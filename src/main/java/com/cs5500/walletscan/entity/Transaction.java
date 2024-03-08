package com.cs5500.walletscan.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
@Data
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column (nullable = false)
    private String category;
    @Column (nullable = false)
    private String amount;
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT-8")
    @Column (nullable = false)
    private Date date;
    @Column (nullable = false)
    private String merchant;
    @Column (nullable = false)
    private Boolean expenses;
    @Column (nullable = false)
    private String currency;
    @Column (nullable = false)
    private Long userid;
    @Column
    private String receipt_img;
}
