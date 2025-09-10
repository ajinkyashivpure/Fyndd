package com.fyndd.backend.model;

public enum CartType {
    PUBLIC("public"),
    PRIVATE("private"),
    HIDDEN("hidden");

    private final String value;

    CartType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static CartType fromString(String value) {
        for (CartType type : CartType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid cart type: " + value);
    }
}