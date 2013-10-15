﻿using System;
using System.Configuration;
using System.Net.Mail;
using System.Text;

namespace UCosmic
{
    public class WorkReportBuilder
    {
        public MailAddressCollection To { get { return _mailMessage.To; } }
        private readonly MailMessage _mailMessage;
        public StringBuilder Message { get; private set; }

        public WorkReportBuilder(string subject, string to = null)
        {
            if (string.IsNullOrWhiteSpace(to))
                to = ConfigurationManager.AppSettings["EmergencyMailAddresses"];

            var from = new MailAddress("cloud@ucosmic.com", "UCosmic Work Reporter");
            _mailMessage = new MailMessage(from, new MailAddress(to))
            {
                Subject = string.Format("UCosmic Work Report: {0}", subject)
            };
            Message = new StringBuilder(string.Format("Generated {0:M/d/yyyy @ HH:mm:ss UTC}", DateTime.UtcNow));
            Message.AppendLine("");
        }

        public void Report(string message, params object[] args)
        {
            Message.AppendLine(string.Format(message, args));
        }

        public MailMessage Build()
        {
            _mailMessage.Body = Message.ToString();
            return _mailMessage;
        }

        public void Send(ISendMail mailSender)
        {
            if (mailSender == null) throw new ArgumentNullException("mailSender");
            mailSender.Send(Build());
        }
    }
}
