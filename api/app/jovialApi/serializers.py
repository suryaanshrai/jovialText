from django.contrib.auth.models import Group
from .models import User, Post, Like, Follower, Reply, Tag, Mention
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'url','username','bio', 'pic']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class PostSerializer(serializers.HyperlinkedModelSerializer):
    like_count = serializers.ReadOnlyField(source='get_like_count')
    
    class Meta:
        model = Post
        fields = ['url', 'id', 'created', 'username', 'title', 'content', 'pic', 'sentiment', 'like_count']
    


class LikeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Like
        fields = ['url','post']


class FollowerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Follower
        fields = ['url','follow', 'created']
        
class ReplySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Reply
        fields = ['url', 'username', 'post', 'content', 'created']