from django.contrib import admin
from .models import User, Post, Follower, Like, Tag, Mention, Reply

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email','id', 'bio']
    search_fields = ['username']

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'username', 'sentiment', 'created']
    search_fields= ['title','content']

@admin.register(Reply)
class ReplyAdmin(admin.ModelAdmin):
    list_display = ['username', 'post']
    
@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    search_fields = ['tag']

@admin.register(Mention)
class MentionAdmin(admin.ModelAdmin):
    list_display = ['username', 'mention', 'created']

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['username', 'post', 'created']
    
@admin.register(Follower)
class FollowerAdmin(admin.ModelAdmin):
    list_display = ['username', 'follow']