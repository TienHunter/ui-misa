$(document).ready(function () {
   initEvents();
   loadData();
});
/**
 * khởi tạo các sự kiện
 * author: VDTien (20/10/2022)
 */
function initEvents() {
   try {
      // toggle Sidebar
      toggleSidebar();
      // open Form
      openForm();
      // hide Form
      hideForm();
      // handleSaveOnClick
      handleSaveOnClick();
   } catch (error) {
      console.error(error);
   }
}
/**
 * load dữ liêu từ db
 * author VDTien (21/10/2022)
 */
async function loadData() {
   let numberReords;
   try {
      // gọi api thực hiện lấy dữ liệu
      await $.ajax({
         type: "GET",
         url: "https://amis.manhnv.net/api/v1/Employees",
         success: function (response) {
            numberReords = response.length;
            for (const item of response) {
               // console.log(item);
               const {
                  EmployeeCode,
                  EmployeeName,
                  GenderName,
                  DateOfBirth,
                  IdentityNumber,
                  IdentityPlace,
                  DepartmentName,
                  BankAccountNumber,
                  BankName,
                  BankBranchName,
               } = item;
               // console.log(item);
               // hiển thị lên table

               $(".m-table__content tbody").append(
                  `
                     <tr>
                        <td class="td-anchor td-anchor--start">
                           <input type="checkbox" />
                        </td>
                        <td>${EmployeeCode}</td>
                        <td>${EmployeeName}</td>
                        <td>${GenderName}</td>
                        <td>${DateOfBirth}</td>
                        <td>${IdentityNumber}</td>
                        <td>${IdentityPlace}</td>
                        <td>${DepartmentName}</td>
                        <td>${BankAccountNumber}</td>
                        <td>${BankName}</td>
                        <td>${BankBranchName}</td>
                        <td class="td-anchor td-anchor--end m-d-flex-auto">

                              <a href="" class>Sửa</a>

                              <div
                                 class="m-icon m-icon--dropdown"
                                 style="position:relative"
                              >
                                 <ul class='dropdownlist'>
                                    <li class='dropdown__item'>Nhân bản</li>
                                    <li class='dropdown__item'>Xóa</li>
                              
                                 </ul>
                        
                           </div>
                        </td>
                     </tr>
                  `
               );
            }
            $(".m-table_pagination .pagination__left b").text(numberReords);
         },
      });

      // xử lý dữ liệu

      // hanlde event click checkbox table
      clickCheckboxTable(numberReords);
      // handle event click dropdown in coloumn action of table
      hamdleClickDropdownActionTable();
   } catch (error) {
      console.log(error);
   }
}
/**
 * toggle sidebar
 * author: VDTien (18/10/2022)
 */
function toggleSidebar() {
   $(".toggle-sidebar .m-icon--menu").click(function () {
      // toggle logo
      $(".header__left").toggle();
      $(this).toggleClass("m-icon--menu-collapse");
      $(this).parent().toggleClass("collapse-sidebar");

      // toggle sidebar
      $(".sidebar").toggleClass("sidebar--collapse");
      $(".sidebar .sidebar-text").fadeToggle();
   });
}
/**
 * open Form employee
 * author VDTien (18/10/2022)
 */
function openForm() {
   $(".main-header__actions .btn__add-employee").click(function () {
      $(".m-form-wrapper").css("display", "flex");
   });
}
/**
 * hide Form employee
 * author VDTien (18/10/2022)
 */
function hideForm() {
   $(".form-header__action .m-icon--close").click(function () {
      $(".m-form-wrapper").hide();
   });
}
/**
 * xử lý dữ liệu và trả về
 * author VDTien (20/10/2022)
 */
function handleSaveOnClick() {
   $(".form-footer__right .btn-primary").click(function () {
      // validate dữ liệu
      let isValid = validateData();
      if (isValid) {
         //thu thập dữ liệu
         let maNhanVien = $("#ma_nhan_vien").val();
         let tenNhanVien = $("#ten_nhan_vien").val();
         // let donVi = "Phòng nhân sự";
         let maDonVi = "142cb08f-7c31-21fa-8e90-67245e8b283e";
         let chucDanh = $("#chuc_danh").val();
         let ngaySinh = $("#ngay_sinh").val();
         let gioiTinh;
         let cccd = $("#cccd").val();
         let ngayCapCCCD = $("#ngay_cap_cccd").val();
         let noiCapCCCD = $("#noi_cap_cccd").val();
         let diaChi = $("#dia_chi").val();
         let dtDiDong = $("#sdt").val();
         let dtCoDinh = $("#sdt_co_dinh").val();
         let email = $("#email").val();
         let tkNganHang = $("#tk_ngan_hang").val();
         let tenNganHang = $("#ten_ngan_hang").val();
         let chiNhanh = $("#chi_nhanh").val();
         // handle select gender
         $(
            ".m-form-wrapper .textfield__container--radio input[type='radio'][name='gender-form']"
         ).each(function () {
            if ($(this).prop("checked") == true) {
               // gioiTinh = $(this).attr("value");
               switch ($(this).attr("value")) {
                  case "0":
                     gioiTinh = "nam";
                     break;
                  case "1":
                     gioiTinh = "nữ";
                     break;
                  case "2":
                     gioiTinh = "khác";
                     break;
                  default:
                     gioiTinh = "";
                     break;
               }
            }
         });
         let employee = {
            EmployeeCode: maNhanVien,
            EmployeeName: tenNhanVien,
            GenderName: gioiTinh,
            PositionName: chucDanh,
            DateOfBirth: ngaySinh,
            IdentityNumber: cccd,
            IdentityDate: ngayCapCCCD,
            IdentityPlace: noiCapCCCD,
            PhoneNumber: dtDiDong,
            DepartmentId: maDonVi,
            Email: email,
            Address: diaChi,
            TelephoneNumber: dtCoDinh,
            BankAccountNumber: tkNganHang,
            BankName: tenNganHang,
            BankBranchName: chiNhanh,
         };

         console.log("employee data: ", employee);
         let statusCode = null;
         //Gọi API thực hiện cất dữ liệu
         fetch("https://amis.manhnv.net/api/v1/employees", {
            method: "POST",
            body: JSON.stringify(employee),
            headers: {
               "Content-Type": "application/json",
               // 'Content-Type': 'application/x-www-form-urlencoded',
            },
         })
            .then((res) => {
               statusCode = res.status;
               return res.json();
            })
            .then((res) => {
               if (statusCode === 400) {
                  alert(res.data.userMsg);
               }
               console.log(res);
            })
            .catch((err) => {
               console.log(err);
            });
         //  kiểm tra kết quả trả vê -> đưa ra thông báo
      }
   });
}
/**
 * thực hiện validate dữ liệu
 * author VDTien (20/10/2022)
 */
function validateData() {
   let isValid = true;
   // các thông tin bắt buộc nhập
   $(".textfield__input--require").each(function () {
      // console.log(element);
      let value = $(this).val();
      if (!value) {
         $(this).addClass("textfield--error");
         isValid = false;
      } else {
         $(this).removeClass("textfield--error");
      }
      // $(this).parent().removeClass("textfield--error");
   });
   // các thông tin đúng định dạng

   // ngày tháng
   return isValid;
}
/**
 * thực hiện hành động click checkbox trong table
 * @param {int} numberReords
 * author VDTien (22/10/2022)
 */
function clickCheckboxTable(numberReords) {
   let numberChecked = 0;
   $("#tblEmployee thead th input").click(function () {
      if ($(this).prop("checked") == true) {
         $("#tblEmployee tbody td input").prop("checked", true);
         // $(".batch-excecution").css("display", "block");
         $(".batch-excecution").fadeIn();
         numberChecked = numberReords;
      } else {
         $("#tblEmployee tbody td input").prop("checked", false);
         // $(".batch-excecution").css("display", "none");
         $(".batch-excecution").fadeOut();

         numberChecked = 0;
      }
      // console.log(numberChecked);
   });
   $;
   $("#tblEmployee tbody td input").click(function () {
      if ($(this).prop("checked") == true) {
         $(this).parent().css("background-color", "#f2f9ff");
         $(this).parent().siblings().css("background-color", "#f2f9ff");
         numberChecked++;
      } else {
         $(this).parent().css("background-color", "#fff");
         $(this).parent().siblings().css("background-color", "#fff");
         numberChecked--;
      }
      if (numberChecked === numberReords) {
         $("#tblEmployee thead th input").prop("checked", true);
      } else {
         $("#tblEmployee thead th input").prop("checked", false);
      }
      if (numberChecked > 0) {
         // $(".batch-excecution").css("display", "block");
         $(".batch-excecution").fadeIn();
      } else {
         // $(".batch-excecution").css("display", "none");
         $(".batch-excecution").fadeOut();
      }
   });
}
/**
 * thực hiện lựa chọn "nhân bản hoặc xóa " trong table
 * author VDTien (22/10/2022)
 */
function hamdleClickDropdownActionTable() {
   let _this;
   $(".m-table__content tbody .m-icon--dropdown").click(function () {
      $(".m-table__content tbody .m-icon--dropdown").addClass("no-selected");
      $(".m-table__content tbody .td-anchor.td-anchor--end").css(
         "z-index",
         "unset"
      );
      _this = $(this);
      $(this).removeClass("no-selected");
      $(".m-table__content tbody .m-icon--dropdown.no-selected")
         .children()
         .hide();
      $(this).children().toggle();
      $(this).parent().css("z-index", 10);
   });
   // $(document).click(function (e) {
   //    if (!_this.is(e.target)) _this.children().hide();
   // });
}
