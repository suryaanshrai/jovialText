from django.shortcuts import render
from django.http import JsonResponse
from .models import User, Posts, Like, Follower, Tag, UserBio, UserPic
from django.core.paginator import Paginator
from textblob import TextBlob


def index(request):
    """
    The index function handles the root URL of the web-application. 
    It returns the landing page of the website which contains the most recent posts.
    """
    return render(request, "network/index.html")


def err_message(request, error_message):
    return render(request, "network/index.html", {"error_message":error_message})

def checkNegativeSentiment(text):
    score = TextBlob(text).sentiment.polarity
    if score <= 0.3:
        return True
    else:
        return False



def getAllPosts(request):
    """
    This function is used to get the recent posts. The function retrieves all the posts 
    from the database and then paginates it into smaller pages of 10 posts each. 
    Pagination is the process of dividing a large list into smaller lists of a particular size. 
    The django.core.paginator module  is used for this purpose.
    By default this function returns the first page of the paginated list of posts. 
    If the “page” parameter of the GET request is set to some number, then that page of the posts is returned.
    """
    allPosts = list(Posts.objects.values())
    allPosts.reverse()
    paginator = Paginator(allPosts, 10)
    page_no = request.GET.get("page")
    if page_no is None:
        page_no = 1
    page_obj = list(paginator.get_page(page_no))
    for i in range(len(page_obj)):
        username = User.objects.get(id=page_obj[i]["poster_id"]).username
        page_obj[i]["username"] = username
        time_t = page_obj[i]["time"]
        time_s = time_t.strftime("%d-%m-%Y at %H:%M")
        page_obj[i]["time"] = time_s
        page_obj[i]["likecount"] = len(Like.objects.filter(post_id=page_obj[i]["id"]))
        if request.user.is_authenticated:
            liked = Like.objects.filter(
                user=request.user, post=Posts.objects.get(id=page_obj[i]["id"])
            )
            if len(liked) == 0:
                page_obj[i]["liked"] = False
            else:
                page_obj[i]["liked"] = True
    return JsonResponse({"allPosts": page_obj, "pagecount": paginator.num_pages, "page": page_no})

def getAllPostsSenti(request):
    """
    This function is the same as getAllPosts(), except that it sorts the list of posts 
    according to the score of sentiment analysis of the content of each post such that the 
    posts are sorted according to decreasing order of the positivity score. 
    """
    allPosts = list(Posts.objects.values())
    for post in allPosts:
        username = User.objects.get(id=post["poster_id"]).username
        post["username"] = username
        post["likecount"] = len(Like.objects.filter(post_id=post["id"]))
        post["score"] = TextBlob(post["content"]).sentiment.polarity
        if request.user.is_authenticated:
            liked = Like.objects.filter(user=request.user, post=Posts.objects.get(id=post["id"]))
            if len(liked) == 0:
                post["liked"] = False
            else:
                post["liked"] = True
    allPosts.sort(key=lambda x:x["score"], reverse=True)
    paginator = Paginator(allPosts, 10)
    page_no = request.GET.get("page")
    if page_no is None:
        page_no = 1
    page_obj = list(paginator.get_page(page_no))
    return JsonResponse(
        {"allPosts": page_obj, "pagecount": paginator.num_pages, "page": page_no})


def searchTags(request):
    """
    This function takes the “tags” parameter of the HTTP request. The “tags” parameter should be 
    a space separated list of tags. The function retrieves all the posts and filters out all the 
    posts that don't contain any of these tags and then returns the list of these posts.
    """
    allPosts = list()
    for tag in request.GET["tags"].split():
        tag = tag.lower()
        tagged_posts = Tag.objects.filter(tag=tag).values()
        for post in tagged_posts:
            thispost = Posts.objects.filter(id=post['post_id']).values()[0]
            username = User.objects.get(id=thispost["poster_id"]).username
            thispost["username"] = username
            thispost["likecount"] = len(Like.objects.filter(post_id=thispost["id"]))
            if thispost not in allPosts:
                allPosts.append(thispost)
    return JsonResponse({"allPosts":allPosts, })


def userpage(request, username):
    """
    This function deals with the /user/<username> URL of the website. The username parameter 
    of the function is the <username> part of the URL. The function returns an HTML page 
    containing the public details of the requested user and the recent posts made by the user.
    """
    user = User.objects.get(username=username)
    allposts = list(Posts.objects.filter(poster=user).values())
    postcount = len(allposts)
    for post in allposts:
        post["likecount"] = len(Like.objects.filter(post_id=post["id"]))
        if request.user.is_authenticated:
            liked = Like.objects.filter(user=request.user, post=Posts.objects.get(id=post["id"]))
            if len(liked) == 0:
                post["liked"] = False
            else:
                post["liked"] = True
    allposts.reverse()
    follower = len(user.followers.all())
    following = len(user.following.all())
    try:
        Follower.objects.get(follower=User.objects.get(username=request.user.username),
                             following=User.objects.get(username=username),)
        follow_status = True
    except:
        follow_status = False
    paginator = Paginator(allposts, 10)
    page_no = request.GET.get("page")
    if page_no is None or int(page_no) < 0 or int(page_no) > paginator.num_pages:
        page_no = 1
    page_obj = list(paginator.get_page(page_no))
    userbio = UserBio.objects.get(user=User.objects.get(username=username))
    userpic = UserPic.objects.get(user=User.objects.get(username=username))
    return render(request, "network/userpage.html",
        {
            "username": username,
            "userbio":userbio,
            "userpic":userpic,
            "posts": page_obj,
            "pagecount": paginator.num_pages,
            "page": page_no,
            "postcount": postcount,
            "followers": follower,
            "following": following,
            "follow_status": follow_status,
        },
    )
