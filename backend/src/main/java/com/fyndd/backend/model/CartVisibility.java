package com.fyndd.backend.model;

public enum CartVisibility {
    PUBLIC("public"),
    PRIVATE("private"),
    HIDDEN("hidden");

    private final String value;

    CartVisibility(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static CartVisibility fromString(String value) {
        for (CartVisibility type : CartVisibility.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid cart type: " + value);
    }
}