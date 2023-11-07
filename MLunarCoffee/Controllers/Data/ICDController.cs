﻿using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using MLunarCoffee.Comon;
using MLunarCoffee.Comon.Crypt;
using MLunarCoffee.Comon.Session;
using MLunarCoffee.Comon.TokenJWT;
using MLunarCoffee.Models.ThirdParty.ICD;

namespace MLunarCoffee.Controllers.Data
{
    [ApiController]
    [Route("api/[controller]")]
    public class ICDController : Controller
    {
        //private string BaseUrl = "https://localhost:44306/";
        private string BaseUrl = "https://api-data.vttechsolution.com/";
        private readonly IConfiguration _config;
        private readonly ITokenService _tokenService;

        public ICDController(IConfiguration config ,ITokenService tokenService)
        {
            _config = config;
            _tokenService = tokenService;
        }
        [Authorize]
        [Route("GetChapterList")]
        [HttpPost]
        public async Task<IActionResult> GetChapterList()
        {
            try
            {
                GlobalUser user = Session.GetUserSession(HttpContext);
                var token = Session.GetSession(HttpContext.Session ,"Token");
                if (token == null)
                {
                    return Content("0");
                }
                if (_tokenService.IsTokenValid(_config["Jwt:Key"].ToString() ,
                    _config["Jwt:Issuer"].ToString() ,token))
                {
                    string shareKey = DateTime.Now.ToString("yyyyMMdd");
                    string AccessToken = Encrypt.EncryptString(shareKey ,Settings.SemiSecret);
                    using (HttpClient clientautho = new HttpClient() { BaseAddress = new Uri(BaseUrl) })
                    {
                        clientautho.DefaultRequestHeaders.Add("AccessToken" ,AccessToken);
                        var result = await clientautho.PostAsync("api/ICD/GetChapterList" ,null);
                        string responseBody = await result.Content.ReadAsStringAsync();
                        if (responseBody != "0")
                        {
                            return Content(responseBody);
                        }
                        return Content("[]");
                    }
                }
                return Content("0");
            }
            catch (Exception ex)
            {
                return Content("0");
            }
        }
        [Authorize]
        [Route("GetDetail")]
        [HttpPost]
        public async Task<IActionResult> GetDetail(ICDDetail iCDDetail)
        {
            try
            {
                GlobalUser user = Session.GetUserSession(HttpContext);
                var token = Session.GetSession(HttpContext.Session ,"Token");
                if (token == null)
                {
                    return Content("0");
                }
                if (_tokenService.IsTokenValid(_config["Jwt:Key"].ToString() ,
                    _config["Jwt:Issuer"].ToString() ,token))
                {
                    string shareKey = DateTime.Now.ToString("yyyyMMdd");
                    string AccessToken = Encrypt.EncryptString(shareKey ,Settings.SemiSecret);

                    var content = new StringContent(JsonConvert.SerializeObject(iCDDetail) ,Encoding.UTF8 ,"application/json");
                    using (HttpClient clientautho = new HttpClient() { BaseAddress = new Uri(BaseUrl) })
                    {
                        clientautho.DefaultRequestHeaders.Add("AccessToken" ,AccessToken);
                        var result = await clientautho.PostAsync("api/ICD/GetDetail" ,content);
                        string responseBody = await result.Content.ReadAsStringAsync();
                        if (responseBody != "0")
                        {
                            return Content(responseBody);
                        }
                        return Content("[]");
                    }
                }
                return Content("0");
            }
            catch (Exception ex)
            {
                return Content("0");
            }
        }
        [Authorize]
        [Route("GetItem/{code}")]
        [HttpGet]
        public async Task<IActionResult> GetItem(string key ,string code)
        {
            try
            {
                GlobalUser user = Session.GetUserSession(HttpContext);
                var token = Session.GetSession(HttpContext.Session ,"Token");
                if (token == null)
                {
                    return Content("0");
                }
                if (_tokenService.IsTokenValid(_config["Jwt:Key"].ToString() ,
                    _config["Jwt:Issuer"].ToString() ,token))
                {
                    string secret = Encrypt.DecryptString(key ,Settings.SemiSecret);


                    string publickey = DateTime.Now.ToString("yyMMdd");
                    if (secret == publickey)
                    {
                        string shareKey = DateTime.Now.ToString("yyyyMMdd");
                        string AccessToken = Encrypt.EncryptString(shareKey ,Settings.SemiSecret);
                        using (HttpClient clientautho = new HttpClient() { BaseAddress = new Uri(BaseUrl) })
                        {
                            clientautho.DefaultRequestHeaders.Add("AccessToken" ,AccessToken);
                            var result = await clientautho.PostAsync($"api/ICD/GetItem/{code}" ,null);
                            string responseBody = await result.Content.ReadAsStringAsync();
                            if (responseBody != "0")
                            {
                                return Content(responseBody);
                            }
                            return Content("[]");
                        }
                    }
                    return Content("[]");
                }
                return Content("0");
            }
            catch (Exception ex)
            {
                return Content("0");
            }
        }

    }
}
