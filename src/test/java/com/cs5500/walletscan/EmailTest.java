package com.cs5500.walletscan;

import com.cs5500.walletscan.Utils.EmailUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;


@RunWith(SpringRunner.class)
@SpringBootTest

public class EmailTest {

        @Autowired
        private EmailUtils mailService;

        @Test
        public void sendmailHtml(){
            mailService.sendHtmlMail("lef_lu@foxmail.com",
                    "Subject：Hello Email",
                    "<h1>Content：This is a test email.</h1>");
        }
    }
