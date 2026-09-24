package com.blogging.blogging_system.dto;

public class DashboardStats {
    private long usersCount;
    private long postsCount;
    private long commentsCount;
    private long likesCount;

    public DashboardStats(long usersCount, long postsCount, long commentsCount, long likesCount) {
        this.usersCount = usersCount;
        this.postsCount = postsCount;
        this.commentsCount = commentsCount;
        this.likesCount = likesCount;
    }

    public long getUsersCount() {
        return usersCount;
    }

    public void setUsersCount(long usersCount) {
        this.usersCount = usersCount;
    }

    public long getPostsCount() {
        return postsCount;
    }

    public void setPostsCount(long postsCount) {
        this.postsCount = postsCount;
    }

    public long getCommentsCount() {
        return commentsCount;
    }

    public void setCommentsCount(long commentsCount) {
        this.commentsCount = commentsCount;
    }

    public long getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(long likesCount) {
        this.likesCount = likesCount;
    }
}
