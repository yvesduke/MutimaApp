using System;
using System.Collections.Generic;
using System.Linq;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using brevo_csharp.Api;
using brevo_csharp.Client;
using brevo_csharp.Model;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using SQLitePCL;


namespace API.Services
{
    public class BrevoEmailService
    {
        private readonly string _apiKey;
        private readonly string _senderEmail;
        private readonly string _senderName;

        public BrevoEmailService(IConfiguration configuration)
        {
            _apiKey = configuration["Brevo:ApiKey"];
            _senderEmail = configuration["Brevo:SenderEmail"];
            _senderName = configuration["Brevo:SenderName"];

            if (string.IsNullOrEmpty(_apiKey))
            {
                throw new ArgumentException("Brevo API key is missing from configuration.");
            }

            if (string.IsNullOrEmpty(_senderEmail) || string.IsNullOrEmpty(_senderName))
                throw new ArgumentException("Brevo sender email or name is missing in the configuration.");


            Configuration.Default.ApiKey.Add("api-key", _apiKey);

        }

        public async System.Threading.Tasks.Task SendEmailAsync(string toEmail, string subject, string htmlContent)
        {
            var apiInstance = new TransactionalEmailsApi();

            var email = new SendSmtpEmail
            {
                Sender = new SendSmtpEmailSender(_senderName, _senderEmail),
                To = new List<SendSmtpEmailTo> { new SendSmtpEmailTo(toEmail) },
                Subject = subject,
                HtmlContent = htmlContent
            };

            try
            {
                await apiInstance.SendTransacEmailAsync(email);
                Console.WriteLine($"Email sent successfully to {toEmail}");
            }
            catch (ApiException e)
            {
                Console.WriteLine($"Error sending email: {e.Message}");
                Console.WriteLine(e.StackTrace);
                throw;
            }
        }
    }
}