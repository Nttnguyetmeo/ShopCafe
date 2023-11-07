﻿using System;
using System.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MLunarCoffee.Comon.Session;

namespace MLunarCoffee.Pages.Report.Account
{
    public class InvoiceMethodPieModel : PageModel
    {
        public string _dateFrom { get; set; }
        public string _dateTo { get; set; }
        public string _branch { get; set; }
        public string _SheetID { get; set; }
        public void OnGet()
        {
            _dateFrom = Request.Query["dateFrom"].ToString();
            _dateTo = Request.Query["dateTo"].ToString();
            _branch = Request.Query["branch"].ToString();
            _SheetID = Request.Query["sheet"].ToString();
        }


        public async Task<IActionResult> OnPostLoadata(string branchID ,string dateFrom ,string dateTo)
        {
            try
            {
                DataTable dt = new DataTable();
                var user = Session.GetUserSession(HttpContext);
                using (Models.ExecuteDataBase confunc = new Models.ExecuteDataBase())
                {

                    dt = await confunc.ExecuteDataTable("[YYY_sp_rp_InvoiceMethodPie]" ,CommandType.StoredProcedure
                       ,"@DateFrom" ,SqlDbType.DateTime ,Comon.Comon.DateTimeDMY_To_YMD(dateFrom)
                       ,"@DateTo" ,SqlDbType.DateTime ,Comon.Comon.DateTimeDMY_To_YMD(dateTo)
                       ,"@BranchID" ,SqlDbType.Int ,Convert.ToInt32(branchID)
                       ,"@isAllBranch" ,SqlDbType.Int ,user.sys_AllBranchID
                       ,"@branchTokenUser" ,SqlDbType.NVarChar ,user.sys_AreaBranch);
                }
                return Content(Comon.DataJson.Datatable(dt));
            }
            catch (Exception)
            {
                return Content("0");
            }
        }
    }
}
