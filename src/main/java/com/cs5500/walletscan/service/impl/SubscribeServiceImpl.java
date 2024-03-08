package com.cs5500.walletscan.service.impl;

import com.cs5500.walletscan.entity.Subscribe;
import com.cs5500.walletscan.repository.SubscribeRepository;
import com.cs5500.walletscan.service.SubscribeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static com.cs5500.walletscan.Utils.ValidationUtils.isValidEmail;

@Service
public class SubscribeServiceImpl implements SubscribeService {
    @Autowired
    private SubscribeRepository subscribeRepository;

    public String saveSubscribe(String email) {
        Subscribe subscribe = new Subscribe();
        if (isValidEmail(email)) {
            subscribe.setEmail(email);
            subscribeRepository.save(subscribe);
            return "Subscribe Successfully";
        } else {
            return "Invalid Email Format";
        }
    }
}
