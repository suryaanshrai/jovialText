from django.contrib import admin
from .models import User, Post, Follower, Like

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email','id', 'bio']
    search_fields = ['username']

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'username', 'time']
    search_fields= ['content']

@admin.register(Follower)
class FollowerAdmin(admin.ModelAdmin):
    list_display = ['username', 'follow']

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['username', 'post', 'time']
