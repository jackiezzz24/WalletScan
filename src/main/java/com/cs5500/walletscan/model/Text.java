package com.cs5500.walletscan.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonDeserialize(builder = Text.Builder.class)
public class Text {
    
    @JsonProperty("description")
    private final String description;
    
    public Text(Builder builder) {
        this.description = builder.description;
    }
    
    public String getDescription() {
        return description;
    }
    
    @JsonIgnoreProperties(ignoreUnknown = true)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonDeserialize(builder = Text.Builder.class)
    public static class Builder {
    
        @JsonProperty("description")
        private String description;
        
        public Builder description(String description) {
            this.description = description;
            return this;
        }
    
        public String getDescription() {
            return description;
        }
    
        public void setDescription(String description) {
            this.description = description;
        }
    
        public Text build() {
            return new Text(this);
        }
    }
}
