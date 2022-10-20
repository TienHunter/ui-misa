$(document).ready(function () {
   initEvents();
   // toggleSidebar();
   // openForm();
   // hideForm();
});
/**
 * khởi tạo các sự kiện
 * author: VDTien (20/10/2022)
 */
function initEvents() {
   // toggle Sidebar
   toggleSidebar();
   // open Form
   openForm();
   // hide Form
   hideForm();
   // handleSaveOnClick
   handleSaveOnClick();
   //
   // validateData();
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
      $(".sidebar .sidebar-text").toggle();
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
      $(".m-form-wrapper").css("display", "none");
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
      //thu thập dữ liệu
      // let employee = {};
      // let employeeStatusCode = "";
      // //Gọi API thực hiện cất dữ liệu
      // fetch("https://amis.manhnv.net/api/v1/Departments", {
      //    method: "POST",
      //    body: JSON.stringify(employee),
      // })
      //    .then((res) => res.json())
      //    .then((res) => {
      //       console.log(res);
      //    })
      //    .catch((err) => {
      //       console.log(err);
      //    });
      // kiểm tra kết quả trả vê -> đưa ra thông báo
   });
}
/**
 * thực hiện validate dữ liệu
 * author VDTien (20/10/2022)
 */
function validateData() {
   // các thông tin bắt buộc nhập

   // let inputRequires = ;
   // console.log(inputRequires);
   $(".textfield__input--require").each(function (index, element) {
      console.log(element);
      let value = $(this).val();
      if (!value) {
         $(this).addClass("textfield--error");
      } else {
         $(this).removeClass("textfield--error");
      }
      // $(this).parent().removeClass("textfield--error");
   });
   // các thông tin đúng định dạng

   // ngày tháng
}
