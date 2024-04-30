from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.db import IntegrityError
from .models import User, Follower


def login_view(request):
    """
    On a GET request the function returns the HTML page with the login form. On a POST request, 
    this method verifies the user. On successful verification the user is logged in, otherwise 
    the same HTML page is returned along with an error message.
    """
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
    """
    This function logs out the user who made the request and redirects the user to the
    home page of the website. (The home and landing page are the same).
    """
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    """
    On a GET request the function returns the HTML page with the registration form. On a POST request, 
    this method creates a new User object and writes it into the database. If a user with the same 
    credentials already exists the method returns an error message and returns the user to the registration 
    page otherwise it redirects to the home page.
    """
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {"message": "Passwords must match."})

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {"message": "Username already taken."})
        
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def isloggedin(request):
    """
    This function return if the requested user is logged in or not.
    """
    if request.user.is_authenticated:
        return JsonResponse({"isloggedin": True})
    else:
        return JsonResponse({"isloggedin": False})


@login_required
def follow(request, tofollow):
    """
    This function deals with the /follow/<username> URL of the website. To access this URL a user must be verified, 
    which is ensured via the login_requried wrapper. The function checks if the follow request already exists in the 
    database. If yes, the function deletes it otherwise it creates a new follower object and writes it into the
    database. The function also ensures that the follower user and the following user are distinct.
    """
    if User.objects.get(username=request.user.username) == User.objects.get(username=tofollow):
        return HttpResponse("Cannot follow yourself")
    followObj = Follower.objects.filter(follower=User.objects.get(username=request.user.username),
                following=User.objects.get(username=tofollow),)
    if (followObj is None):
        new_follow = Follower(follower=User.objects.get(username=request.user.username),
            following=User.objects.get(username=tofollow),)
        new_follow.save()
        return HttpResponseRedirect(reverse("userpage", args=(tofollow,)))
    followObj.delete()
    return HttpResponseRedirect(reverse("userpage", args=(tofollow,)))