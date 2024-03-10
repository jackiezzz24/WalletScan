package com.cs5500.walletscan.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionsDto {
    private Long id;
    private String category;
    private String amount;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT-8")
    private Date date;
    private String merchant;
    private Boolean expenses;
    private String currency;
    private Long userid;
    private String receipt_img;
    private String description;
}
