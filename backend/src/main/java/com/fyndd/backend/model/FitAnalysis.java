package com.fyndd.backend.model;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FitAnalysis {
    private String length;
    private String width;
    private String proportion;
}