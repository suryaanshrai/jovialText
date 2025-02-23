from rest_framework import permissions, viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import CursorPagination
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User, Follower, Like, Post, Tag

from jovialApi.serializers import UserSerializer, PostSerializer, FollowerSerializer, LikeSerializer

    
    

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    class IsOwnerOrReadOnly(permissions.BasePermission):
        def has_object_permission(self, request, view, obj):
            if request.method in permissions.SAFE_METHODS:
                return True
            return obj.id == request.user.id

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self,):
        if self.action == 'list':
            if self.request.user.is_authenticated:
                return User.objects.filter(username=self.request.user.username) 
            return User.objects.none()
        return User.objects.all()

    def create(self, request, *args, **kwargs):
        raise PermissionDenied("You do not have permission to create a new user.")
    
    
    
    
class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows posts to be viewed or edited.
    """
    class IsPostOwnerOrReadOnly(permissions.BasePermission):
        def has_object_permission(self, request, view, obj):
            if request.method in permissions.SAFE_METHODS:
                return True
            return obj.username.id == request.user.id

    class PostPagination(CursorPagination):
        page_size = 10

    queryset = Post.objects.all().order_by('-created')
    permission_classes = [IsAuthenticatedOrReadOnly, IsPostOwnerOrReadOnly]
    pagination_class = PostPagination
    serializer_class = PostSerializer

    def perform_create(self, serializer):
        serializer.save(username=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def following(self, request):
        following = Follower.objects.filter(username=self.request.user).values_list('follow', flat=True)
        posts = Post.objects.filter(username__in=following)
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def liked(self, request):
        liked = Like.objects.filter(username=self.request.user).values_list('post', flat=True)
        posts = Post.objects.filter(id__in=liked)
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)
    


class LikeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows likes to be viewed or edited.
    """
    queryset = Like.objects.all().order_by('-created')
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Like.objects.filter(username=self.request.user)

    def perform_create(self, serializer):
        from django.db import IntegrityError
        try:
            serializer.save(username=self.request.user)
        except IntegrityError:
            raise PermissionDenied("You have already liked this post.")



class FollowerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows followers to be viewed or edited.
    """
    queryset = Follower.objects.all().order_by('-created')
    serializer_class = FollowerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Follower.objects.filter(username=self.request.user)

    def perform_create(self, serializer):
        from django.db import IntegrityError
        try:
            serializer.save(username=self.request.user)
        except IntegrityError:
            raise PermissionDenied("You are already following this user.")
            
        


class PositivePostsViewset(viewsets.ReadOnlyModelViewSet):
    class PositivePostsPagination(CursorPagination):
        page_size = 10
        ordering = '-sentiment'
        
    queryset = Post.objects.all().order_by('-sentiment')
    serializer_class = PostSerializer
    pagination_class = PositivePostsPagination


class SearchView(APIView):
    class Pagination(CursorPagination):
        page_size = 10

    def get(self, request):
        query = request.query_params.get('query')
        
        if query is None:
            return Response([])
        
        if query.startswith('@'):
            users = User.objects.filter(username__icontains=query[1:])
            queryset = users
            serializer_class = UserSerializer
        elif query.startswith('#'):
            tags = Tag.objects.filter(tag__icontains=query[1:])
            post_ids = tags.values_list('post_id', flat=True)
            queryset = Post.objects.filter(id__in=post_ids)
            serializer_class = PostSerializer
        else:
            posts = Post.objects.filter(content__icontains=query)
            queryset = posts
            serializer_class = PostSerializer
        
        paginator = self.Pagination()
        page = paginator.paginate_queryset(queryset, request)
        if page is not None:
            serializer = serializer_class(page, many=True, context={'request': request})
            return paginator.get_paginated_response(serializer.data)
        
        serializer = serializer_class(queryset, many=True, context={'request': request})
        return Response(serializer.data)