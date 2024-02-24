package com.yyy;

import org.apache.commons.lang3.builder.ToStringBuilder;

public class Cerchio {


    private float raggio;

    public Cerchio(float raggio) {
        this.raggio = raggio;
    }

    public float getRaggio() {
        return raggio;
    }

    public void setRaggio(float raggio) {
        this.raggio = raggio;
    }

    public static void main(String[] args) throws Exception {
        System.out.println("Hello, World!");
    }

    @Override
    public String toString() {
        // return "Cerchio [raggio=" + raggio + "]";
        return ToStringBuilder.reflectionToString(this);
    }   
}