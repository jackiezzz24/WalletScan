package com.cs5500.walletscan.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionsDto {
    private long id;
    private String catagory;
    private String amount;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT-8")
    private Date date;
    private String merchant;
    private boolean expenses;
    private String currency;
    private long userid;
    private String receipt_img;

}
