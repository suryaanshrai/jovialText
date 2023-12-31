from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from transformers import pipeline

from .models import User, Posts, Like, Follower, Tag


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(
                request,
                "network/login.html",
                {"message": "Invalid username and/or password."},
            )
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(
                request, "network/register.html", {"message": "Passwords must match."}
            )

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(
                request, "network/register.html", {"message": "Username already taken."}
            )
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def err_message(request, error_message):
    return render(request, "network/index.html", {
        "error_message":error_message
    })

def checkNegativeSentiment(text):
    sentiment_pipeline = pipeline('sentiment-analysis')
    analysis = sentiment_pipeline([text])
    if analysis[0]['label'] == 'NEGATIVE':
        return True
    else:
        return False

@login_required
def createpost(request):
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
    else:
        return HttpResponse("Please login and submit the form. (Post method required)")


def getAllPosts(request):
    allPosts = list(Posts.objects.values())
    content = list()
    for post in allPosts:
        content.append(post['content'])
    sentiment_pipeline = pipeline('sentiment-analysis')
    analysis = sentiment_pipeline(content)
    for i in range(len(allPosts)):
        if analysis[i]['label'] == 'NEGATIVE':
            continue
        allPosts[i]['score'] = analysis[i]['score']
        username = User.objects.get(id=allPosts[i]["poster_id"]).username
        allPosts[i]["username"] = username
        allPosts[i]["likecount"] = len(Like.objects.filter(post_id=allPosts[i]["id"]))
        if request.user.is_authenticated:
            liked = Like.objects.filter(
                user=request.user, post=Posts.objects.get(id=allPosts[i]["id"])
            )
            if len(liked) == 0:
                allPosts[i]["liked"] = False
            else:
                allPosts[i]["liked"] = True
    allPosts.sort(key=lambda x:x['score'], reverse=True)
    paginator = Paginator(allPosts, 10)
    page_no = request.GET.get("page")
    if page_no is None:
        page_no = 1
    page_obj = list(paginator.get_page(page_no))
    return JsonResponse(
        {"allPosts": page_obj, "pagecount": paginator.num_pages, "page": page_no}
    )

def getAllPostsChrono(request):
    allPosts = list(Posts.objects.values())
    for post in allPosts:
        username = User.objects.get(id=post["poster_id"]).username
        post["username"] = username
        post["likecount"] = len(Like.objects.filter(post_id=post["id"]))
        if request.user.is_authenticated:
            liked = Like.objects.filter(
                user=request.user, post=Posts.objects.get(id=post["id"])
            )
            if len(liked) == 0:
                post["liked"] = False
            else:
                post["liked"] = True
    allPosts.reverse()
    paginator = Paginator(allPosts, 10)
    page_no = request.GET.get("page")
    if page_no is None:
        page_no = 1
    page_obj = list(paginator.get_page(page_no))
    return JsonResponse(
        {"allPosts": page_obj, "pagecount": paginator.num_pages, "page": page_no}
    )


@login_required
def like_post(request, postid):
    # Likes or Unlikes a post
    if request.method == "POST":
        if (
            len(
                Like.objects.filter(
                    user=request.user, post=Posts.objects.get(id=postid)
                )
            )
            == 0
        ):
            new_like = Like(user=request.user, post=Posts.objects.get(id=postid))
            new_like.save()
            likecount = len(Like.objects.filter(post_id=postid))
            return JsonResponse({"likestatus": "liked", "newlikecount": likecount})
        else:
            new_like = Like.objects.get(
                user=request.user, post=Posts.objects.get(id=postid)
            )
            new_like.delete()
            likecount = len(Like.objects.filter(post_id=postid))
            return JsonResponse({"likestatus": "unliked", "newlikecount": likecount})
    return HttpResponse("Invalid Request")


def userpage(request, username):
    user = User.objects.get(username=username)
    allposts = list(Posts.objects.filter(poster=user).values())
    postcount = len(allposts)
    for post in allposts:
        post["likecount"] = len(Like.objects.filter(post_id=post["id"]))
        liked = Like.objects.filter(
            user=request.user, post=Posts.objects.get(id=post["id"])
        )
        if len(liked) == 0:
            post["liked"] = False
        else:
            post["liked"] = True
    allposts.reverse()
    follower = len(user.followers.all())
    following = len(user.following.all())
    try:
        Follower.objects.get(
            follower=User.objects.get(username=request.user.username),
            following=User.objects.get(username=username),
        )
        follow_status = True
    except:
        follow_status = False
    paginator = Paginator(allposts, 10)
    page_no = request.GET.get("page")
    if page_no is None or int(page_no) < 0 or int(page_no) > paginator.num_pages:
        page_no = 1
    page_obj = list(paginator.get_page(page_no))
    return render(
        request,
        "network/userpage.html",
        {
            "username": username,
            "posts": page_obj,
            "pagecount": paginator.num_pages,
            "page": page_no,
            "postcount": postcount,
            "followers": follower,
            "following": following,
            "follow_status": follow_status,
        },
    )


@login_required
def follow(request, tofollow):
    if not request.user.is_authenticated:
        return HttpResponse("Login Required")
    if User.objects.get(username=request.user.username) == User.objects.get(
        username=tofollow
    ):
        return HttpResponse("Cannot follow yourself")
    if (
        len(
            Follower.objects.filter(
                follower=User.objects.get(username=request.user.username),
                following=User.objects.get(username=tofollow),
            )
        )
        == 0
    ):
        new_follow = Follower(
            follower=User.objects.get(username=request.user.username),
            following=User.objects.get(username=tofollow),
        )
        new_follow.save()
        return HttpResponseRedirect(reverse("userpage", args=(tofollow,)))
    old_follow = Follower.objects.get(
        follower=User.objects.get(username=request.user.username),
        following=User.objects.get(username=tofollow),
    )
    old_follow.delete()
    return HttpResponseRedirect(reverse("userpage", args=(tofollow,)))


@login_required
def following_posts(request):
    allPosts = []
    for user in User.objects.get(username=request.user.username).following.all():
        allPosts += user.following.posts.values()
    allPosts.sort(key=lambda x: x["id"])
    for post in allPosts:
        post["username"] = User.objects.get(id=post["poster_id"]).username
        post["likecount"] = len(Like.objects.filter(post_id=post["id"]))
        if request.user.is_authenticated:
            liked = Like.objects.filter(
                user=request.user, post=Posts.objects.get(id=post["id"])
            )
            if len(liked) == 0:
                post["liked"] = False
            else:
                post["liked"] = True
    paginator = Paginator(allPosts, 10)
    page_no = request.GET.get("page")
    if page_no is None:
        page_no = 1
    page_obj = list(paginator.get_page(page_no))
    return JsonResponse(
        {"allPosts": page_obj, "pagecount": paginator.num_pages, "page": page_no}
    )


def isloggedin(request):
    if request.user.is_authenticated:
        return JsonResponse({"isloggedin": True})
    else:
        return JsonResponse({"isloggedin": False})


@login_required
def editpost(request, id):
    if request.method == "POST":
        post = Posts.objects.get(id=id)
        if post.poster != request.user:
            return JsonResponse({
                "Response":"Inappropriate user",
            })
        post_content = request.POST["post_content"]
        if checkNegativeSentiment(post_content):
            return JsonResponse({
                "post_content":post.content,
                "Response":"The new content may contain inappropriate words or sentences",
            })
        post.content = post_content
        post.save()
        return JsonResponse({"post_content": post_content,})
    return JsonResponse({
        "Response":"Invalid Request",
    })


def searchTags(request):
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
            
    return JsonResponse({
        "allPosts":allPosts, 
    })