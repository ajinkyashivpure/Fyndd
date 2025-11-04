package com.fyndd.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StyleItem {
    private String category;
    private String style;
    private String reason;
    private List<String> examples;
}
//this is just a comment