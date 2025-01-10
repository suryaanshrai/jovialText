from django.contrib.auth.models import Group
from rest_framework import permissions, viewsets, generics

from .models import User, Follower, Like, Post

from jovialApi.serializers import UserSerializer, PostSerializer, FollowerSerializer, LikeSerializer
    

class UserViewSet(
    viewsets.ModelViewSet,
):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = []
    


class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows posts to be viewed or edited.
    """
    queryset = Post.objects.all().order_by('time')
    serializer_class = PostSerializer
    permission_classes = []

    def get_queryset(self):
        return Post.objects.filter(username=self.request.user)

    def perform_create(self, serializer):
        serializer.save(username=self.request.user)


class LikeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows likes to be viewed or edited.
    """
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = []

    def get_queryset(self):
        return Like.objects.filter(username=self.request.user)

    def perform_create(self, serializer):
        print(serializer)
        serializer.save(username=self.request.user)


class FollowerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows followers to be viewed or edited.
    """
    queryset = Follower.objects.all()
    serializer_class = FollowerSerializer
    permission_classes = []

    def get_queryset(self):
        return Follower.objects.filter(username=self.request.user)

    def perform_create(self, serializer):
        serializer.save(username=self.request.user)