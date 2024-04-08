package com.cs5500.walletscan;

import com.cs5500.walletscan.Utils.EmailUtils;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@MockitoSettings(strictness = Strictness.STRICT_STUBS)
public class EmailUtilsTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailUtils emailUtils;

    @Test
    public void testSendSimpleMail() {
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        String to = "recipient@example.com";
        String subject = "Test Subject";
        String content = "Test Content";

        emailUtils.sendSimpleMail(to, subject, content);

        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender, times(1)).send(messageCaptor.capture());

        SimpleMailMessage capturedMessage = messageCaptor.getValue();
        assertEquals(to, capturedMessage.getTo()[0]);
        assertEquals(subject, capturedMessage.getSubject());
        assertEquals(content, capturedMessage.getText());
    }
}

