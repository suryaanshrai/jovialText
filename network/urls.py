from django.urls import path, include

from . import home_views, user_views, post_views


urlpatterns = [
    path("", home_views.index, name="index"),
    path("getAllPosts/", home_views.getAllPosts, name="getAllPosts"),
    path("getAllPostsSenti/", home_views.getAllPostsSenti, name="getAllPostsSenti"),
    path("searchTags/", home_views.searchTags, name="searchTags"),
    path("user/<str:username>/", home_views.userpage, name="userpage"),
    
    path("login/", user_views.login_view, name="login"),
    path("logout/", user_views.logout_view, name="logout"),
    path("register/", user_views.register, name="register"),
    path("isloggedin/", user_views.isloggedin, name="isloggedin"),
    path("follow/<str:tofollow>/", user_views.follow, name="follow"),
    path('accounts/', include('allauth.urls')),

    path("createpost/", post_views.createpost, name="createpost"),
    path("editpost/<int:id>/", post_views.editpost, name="editpost"),
    path("likePost/<int:postid>/", post_views.like_post, name="likePost"),
    path("following/", post_views.following_posts, name="following"),
]
