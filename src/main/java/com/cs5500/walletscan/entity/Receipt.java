package com.cs5500.walletscan.entity;

public class Receipt {

    private String storeName;

    private double total;

    private String date;

    public Receipt(Builder builder) {
        this.storeName = builder.storeName;
        this.total = builder.total;
        this.date = builder.date;
    }

    public String getStoreName() {
        return storeName;
    }

    public double getTotal() {
        return total;
    }

    public String getDate() {
        return date;
    }

    public static class Builder {
        private String storeName;

        private double total;

        private String date;

        public Builder storeName(String storeName) {
            this.storeName = storeName;
            return this;
        }

        public Builder total(double total) {
            this.total = total;
            return this;
        }

        public Builder date(String date) {
            this.date = date;
            return this;
        }

        public Receipt build() {
            return new Receipt(this);
        }
    }
}
