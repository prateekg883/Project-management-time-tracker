package com.timetracker.model;

public enum UserRole {
    ADMIN("Admin"),
    PROJECT_MANAGER("Project Manager"),
    TEAM_MEMBER("Team Member");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}