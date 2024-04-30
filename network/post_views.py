from django.contrib.auth.decorators import login_required
from .home_views import checkNegativeSentiment, err_message
from .models import Posts, Tag, Like, User
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.core.paginator import Paginator


@login_required
def createpost(request):
    """
    On a POST request from a verified user, this function creates a new post object, 
    does a sentiment analysis on its content and any tags that the user might’ve added 
    with the post. It then redirects the user to the homepage.
    """
    if request.method == "POST":
        poster = request.user
        post_content = request.POST["content"]
        # First check
        tags = request.POST["tags"].split()

        if checkNegativeSentiment(post_content):
            return err_message(request,"Sorry, your post contains word/s that might be harsh.")
        
        new_post = Posts(poster=poster, content=post_content)
        new_post.save()
        for tag in tags:
            if checkNegativeSentiment(tag):
                return err_message(request, "Sorry your tag contains word/s that might be harsh.")
            new_tag = Tag(tag=tag.lower(), post=new_post)
            new_tag.save()
        return HttpResponseRedirect(reverse("index"))
    
@login_required
def editpost(request, id):
    """
    The function takes in an HTTP request and an ID of the post that must be edited. 
    It first verifies if the user who made the request is the same as the user who made the post. 
    Then after sentiment analysis of the new content, the database is updated with the new content of the post.
    """
    if request.method == "POST":
        post = Posts.objects.get(id=id)
        if post.poster != request.user:
            return JsonResponse({"Response":"Inappropriate user",})
        post_content = request.POST["post_content"]
        if checkNegativeSentiment(post_content):
            return JsonResponse({
                "post_content":post.content,
                "Response":"The new content may contain inappropriate words or sentences",
            })
        post.content = post_content
        post.save()
        return JsonResponse({"post_content": post_content,})
    return JsonResponse({"Response":"Invalid Request",})
    
@login_required
def like_post(request, postid):
    """
    This function takes a postid parameter which is the ID of the post that must be liked. 
    The function first checks whether this user have previously liked the same post. 
    If yes the like object is deleted from the database otherwise a new like object is created.
    """
    if request.method == "POST":
        if (len(Like.objects.filter(user=request.user, post=Posts.objects.get(id=postid)))== 0):
            new_like = Like(user=request.user, post=Posts.objects.get(id=postid))
            new_like.save()
            likecount = len(Like.objects.filter(post_id=postid))
            return JsonResponse({"likestatus": "liked", "newlikecount": likecount})
        else:
            likeObj = Like.objects.get(user=request.user, post=Posts.objects.get(id=postid))
            likeObj.delete()
            likecount = len(Like.objects.filter(post_id=postid))
            return JsonResponse({"likestatus": "unliked", "newlikecount": likecount})
    return HttpResponse("Invalid Request")


@login_required
def following_posts(request):
    """
    This function returns the list of all the posts made by the users that the user who made the request is following.
    """
    allPosts = []
    for user in User.objects.get(username=request.user.username).following.all():
        allPosts += user.following.posts.values()
    allPosts.sort(key=lambda x: x["id"])
    for post in allPosts:
        post["username"] = User.objects.get(id=post["poster_id"]).username
        post["likecount"] = len(Like.objects.filter(post_id=post["id"]))
        if request.user.is_authenticated:
            liked = Like.objects.filter(user=request.user, post=Posts.objects.get(id=post["id"]))
            if len(liked) == 0:
                post["liked"] = False
            else:
                post["liked"] = True
    paginator = Paginator(allPosts, 10)
    page_no = request.GET.get("page")
    if page_no is None:
        page_no = 1
    page_obj = list(paginator.get_page(page_no))
    return JsonResponse({"allPosts": page_obj, "pagecount": paginator.num_pages, "page": page_no})