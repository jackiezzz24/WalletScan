package com.cs5500.walletscan.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "subscribes")
@AllArgsConstructor
@NoArgsConstructor
public class Subscribe {
    @Id
    @Column(nullable = false, unique = true)
    private String email;
}
