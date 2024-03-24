package com.cs5500.walletscan;

import com.cs5500.walletscan.service.EmailService;
import com.cs5500.walletscan.Utils.EmailUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;


@RunWith(SpringRunner.class)
@SpringBootTest

public class EmailTest {

        /**
         * 注入发送邮件的接口
         */
        @Autowired
        private EmailUtils mailService;

//        /**
//         * 测试发送文本邮件
//         */
//        @Test
//        public void sendmail() {
//            mailService.sendSimpleMail("xxx@qq.com","主题：你好普通邮件","内容：第一封邮件");
//        }

        @Test
        public void sendmailHtml(){
            mailService.sendHtmlMail("lef_lu@foxmail.com","主题：你好html邮件","<h1>内容：第一封html邮件</h1>");
        }
    }
