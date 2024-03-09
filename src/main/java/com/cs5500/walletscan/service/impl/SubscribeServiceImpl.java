package com.cs5500.walletscan.service.impl;

import com.cs5500.walletscan.Utils.ValidationUtils;
import com.cs5500.walletscan.entity.Subscribe;
import com.cs5500.walletscan.repository.SubscribeRepository;
import com.cs5500.walletscan.service.SubscribeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class SubscribeServiceImpl implements SubscribeService {
    @Autowired
    private SubscribeRepository subscribeRepository;
    @Autowired
    private ValidationUtils validationUtils;

    public String saveSubscribe(String email) {
        Subscribe subscribe = new Subscribe();
        if (validationUtils.isValidEmail(email)) {
            subscribe.setEmail(email);
            subscribeRepository.save(subscribe);
            return "Subscribe Successfully";
        } else {
            return "Invalid Email Format";
        }
    }
}
