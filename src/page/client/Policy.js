import React, { useEffect, useState } from "react";
import { Carousel, Col, Row, Button, Breadcrumb } from "antd";
import Spinner from "../../elements/spinner";
import { useParams, useHistory, useLocation, Link } from "react-router-dom";
import {
  BulbFilled,
  FormatPainterFilled,
  CompassFilled,
  ToolFilled,
} from "@ant-design/icons";
import Slider from "react-slick";

export default function Policy() {
  return (
    <div style={{ marginTop: 20, marginLeft: 30 }}>
      <Breadcrumb style={{ fontSize: 18, padding: "20px 20px" }}>
        <Breadcrumb.Item>
          <Link to={"/home"}>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{`Policy`}</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{display: "block", marginLeft: 30, marginRight: 40, marginBottom: 40}}>
        <h2 style={{fontWeight: "bold"}}>I. GIỚI THIỆU</h2>
        <span className="text">
          1.1. Chào mừng bạn đến với nền tảng TrungAnh Shop (bao gồm website TrungAnh Shop và ứng dụng di động). Thời trang thực hiện nghiêm túc trách nhiệm của mình liên quan đến bảo mật thông tin theo quy định về bảo vệ bí mật thông tin cá nhân của pháp luật Việt Nam (“Luật Bảo mật”) và cam kết tôn trọng quyền riêng tư và lợi ích của tất cả người dùng trên trang web và ứng dụng di động của chúng tôi (“Nền tảng” ) (chúng tôi gọi chung là Nền tảng và các dịch vụ chúng tôi cung cấp như được mô tả trong Nền tảng của chúng tôi). Tôi là "Dịch vụ"). Người dùng nghĩa là người đăng ký tài khoản với chúng tôi để sử dụng Dịch vụ, bao gồm cả người mua và người bán (gọi chung và gọi riêng là “Người dùng”, “bạn” hoặc “của bạn”). . Chúng tôi nhận thức được tầm quan trọng của dữ liệu cá nhân mà bạn đã giao phó cho chúng tôi và tin rằng chúng tôi có trách nhiệm quản lý, bảo vệ và xử lý dữ liệu cá nhân của bạn một cách thích hợp. Chính sách quyền riêng tư này ("Chính sách quyền riêng tư" hoặc "Chính sách") được thiết kế để giúp bạn hiểu cách chúng tôi thu thập, sử dụng, tiết lộ và/hoặc xử lý dữ liệu cá nhân mà bạn đã gửi cho chúng tôi. Cung cấp cho chúng tôi và/hoặc thông tin về bạn, dù là bây giờ hay trong tương lai và để giúp bạn đưa ra quyết định sáng suốt trước khi cung cấp cho chúng tôi bất kỳ dữ liệu cá nhân nào của bạn.
        </span>
        <span className="text">1.2.“Dữ liệu cá nhân” hay “dữ liệu cá nhân” nghĩa là dữ liệu, dù đúng hay không, về một cá nhân mà một cá nhân có thể được nhận dạng hoặc từ dữ liệu đó và thông tin khác mà tổ chức có hoặc có khả năng truy cập. Các ví dụ phổ biến về dữ liệu cá nhân có thể bao gồm tên, số chứng minh nhân dân và thông tin liên hệ.</span>
        <span className="text">1.3. Bằng cách sử dụng Dịch vụ, đăng ký tài khoản với chúng tôi hoặc truy cập Nền tảng, bạn thừa nhận và đồng ý rằng bạn chấp nhận các thông lệ, yêu cầu và/hoặc chính sách được mô tả trong Chính sách này, Chính sách quyền riêng tư và qua đây bạn xác nhận rằng bạn đã cung cấp đầy đủ thông tin của mình. biết và đồng ý với việc chúng tôi thu thập, sử dụng, tiết lộ và/hoặc xử lý dữ liệu cá nhân của bạn như được mô tả ở đây. NẾU BẠN KHÔNG ĐỒNG Ý XỬ LÝ DỮ LIỆU CÁ NHÂN NHƯ ĐƯỢC MÔ TẢ TRONG CHÍNH SÁCH NÀY, VUI LÒNG KHÔNG SỬ DỤNG DỊCH VỤ CỦA CHÚNG TÔI HOẶC TRUY CẬP NỀN TẢNG HOẶC TRANG WEB CỦA CHÚNG TÔI. Nếu chúng tôi thay đổi Chính sách quyền riêng tư của mình, chúng tôi sẽ thông báo cho bạn bao gồm cả việc đăng những thay đổi đó hoặc Chính sách quyền riêng tư đã sửa đổi trên Nền tảng của chúng tôi. Trong phạm vi được pháp luật cho phép, việc bạn tiếp tục sử dụng Dịch vụ hoặc Nền tảng, bao gồm cả các giao dịch của mình, cấu thành sự thừa nhận và đồng ý của bạn đối với những thay đổi trong Chính sách quyền riêng tư này.</span>
        <h2 style={{fontWeight: "bold"}}>II. KHI NÀO CHÚNG TÔI SẼ THU THẬP DỮ LIỆU CỦA BẠN?</h2>
        <span className="text">2.1. Chúng tôi sẽ/có thể thu thập dữ liệu cá nhân về bạn:</span>
        <span className="text">- Khi bạn đăng ký và/hoặc sử dụng Dịch vụ hoặc Nền tảng của chúng tôi hoặc mở tài khoản với chúng tôi;</span>
        <span className="text">- Khi bạn gửi bất kỳ biểu mẫu nào, bao gồm đơn đăng ký hoặc các biểu mẫu khác liên quan đến bất kỳ sản phẩm và dịch vụ nào của chúng tôi, dù trực tuyến hay hình thức khác;</span>
        <span className="text">- Khi bạn ký kết bất kỳ thỏa thuận nào hoặc cung cấp tài liệu hoặc thông tin khác liên quan đến hoạt động tương tác của bạn với chúng tôi hoặc khi bạn sử dụng các sản phẩm và dịch vụ của chúng tôi;</span>
        <span className="text">- Khi bạn tương tác với chúng tôi, chẳng hạn như qua các cuộc gọi điện thoại (có thể được ghi âm), thư, fax, gặp mặt trực tiếp, nền tảng truyền thông xã hội và email;</span>
        <span className="text">- Khi bạn sử dụng các dịch vụ điện tử của chúng tôi hoặc tương tác với chúng tôi thông qua Nền tảng hoặc Trang web hoặc Dịch vụ của chúng tôi. Điều này bao gồm thông qua các cookie mà chúng tôi có thể triển khai khi bạn tương tác với Nền tảng hoặc Trang web của chúng tôi;</span>
        <span className="text">- Khi bạn cấp quyền cho thiết bị của mình chia sẻ thông tin với ứng dụng hoặc Nền tảng của chúng tôi.</span>
        <span className="text">2.2. Chúng tôi có thể thu thập thông tin của bạn từ bạn, các chi nhánh, bên thứ ba và từ các nguồn khác, bao gồm nhưng không giới hạn ở các đối tác kinh doanh (ví dụ: nhà cung cấp dịch vụ). vận chuyển, thanh toán), cơ quan xếp hạng tín dụng, nhà cung cấp dịch vụ tiếp thị và giới thiệu, chương trình khách hàng thân thiết, những người dùng khác Dịch vụ của chúng tôi hoặc các nguồn dữ liệu có sẵn công khai hoặc nguồn dữ liệu nhà nước.</span>
        <h2 style={{fontWeight: "bold"}}>III. CHÚNG TÔI SẼ THU THẬP DỮ LIỆU NÀO?</h2>
        <span className="text">3.1.Trừ khi có quy định khác trong Chính sách này, dữ liệu cá nhân mà Shopee có thể thu thập bao gồm dữ liệu cá nhân cơ bản và dữ liệu cá nhân nhạy cảm (theo quy định của Luật Quyền riêng tư) như được liệt kê bên dưới. được liệt kê dưới đây:</span>
        <span className="text">- Họ và tên</span>
        <span className="text">- Địa chỉ email</span>
        <span className="text">- Ngày sinh</span>
        <span className="text">- Địa chỉ thanh toán và/hoặc giao hàng;</span>
        <span className="text">- Thông tin tài khoản ngân hàng và thanh toán</span>
        <span className="text">- Số điện thoại</span>
        <span className="text">- Giới tính</span>
        <span className="text">- Thông tin được gửi bởi hoặc liên quan đến (các) thiết bị được sử dụng để truy cập Dịch vụ hoặc Nền tảng của chúng tôi</span>
        <span className="text">- Thông tin về mạng của bạn, bao gồm danh sách liên hệ khi đồng ý chia sẻ trên thiết bị của bạn cũng như những người và tài khoản mà bạn tương tác.</span>
        </div>
    </div>
  );
}
