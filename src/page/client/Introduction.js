import React, { useEffect, useState } from "react";
import logo from "../../images/logo.png";
import { Card, Col, Row, Breadcrumb } from "antd";
import Spinner from "../../elements/spinner";
import { useParams, useHistory, useLocation, Link } from "react-router-dom";
import { CarTwoTone, ShoppingTwoTone, LikeTwoTone, MobileTwoTone } from "@ant-design/icons";
import Slider from "react-slick";

export default function Introduction() {
  return (
    <div style={{ marginTop: 20, marginLeft: 30 }}>
      <Breadcrumb style={{ fontSize: 18, padding: "20px 20px" }}>
        <Breadcrumb.Item>
          <Link to={"/home"}>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{`Introduction`}</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          display: "block",
          marginLeft: 30,
          marginRight: 40,
          marginBottom: 40,
        }}
      >
        <span className="text">
        Chào mừng bạn đến với TrungAnh Shop - điểm đến hàng đầu dành cho những người yêu thời trang đang tìm kiếm phong cách độc đáo. Tại đây, chúng tôi tự hào giới thiệu bộ sưu tập đa dạng gồm hàng nghìn sản phẩm chất lượng cao, từ áo phông thoải mái đến quần jean thời trang, mang đến cho bạn trải nghiệm mua sắm thú vị và độc đáo. Để hiểu rõ hơn về chúng tôi, đừng bỏ lỡ bài viết sau đây.
        </span>
        <h2 style={{ fontWeight: "bold" }}>TỔNG QUAN VỀ THỜI TRANG TRUNGANH SHOP</h2>
        <span className="text">
        Với sứ mệnh tạo ra một không gian mua sắm trực tuyến lý tưởng, chúng tôi cam kết cung cấp những sản phẩm chất lượng hàng đầu đến từ thương hiệu uy tín và những thiết kế mới nhất, phản ánh xu hướng thời trang hiện đại. Chất liệu cao cấp và sự chăm chút tỉ mỉ trong từng đường may là ưu tiên hàng đầu của chúng tôi. Ngoài ra, trải nghiệm mua sắm tại TrungAnh Shop không chỉ là lựa chọn sản phẩm mà còn là hành trình khám phá phong cách cá nhân của bạn. Chúng tôi luôn cập nhật những xu hướng thời trang mới nhất và đưa ra những gợi ý phối hợp trang phục để bạn có thể tạo nên phong cách riêng, độc đáo cho riêng mình.
        </span>
        <span className="text">
        Hãy tham gia cùng chúng tôi trên hành trình thời trang đầy phong cách và tự tin. Dù bạn là người đam mê thời trang hay đang tìm kiếm những bộ trang phục thường ngày, TrungAnh Shop chính là nơi lý tưởng để thỏa mãn niềm đam mê của bạn. Khám phá ngay bây giờ và biến giấc mơ thời trang của bạn thành hiện thực!
        </span>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
        >
          <img
            className="img-logo"
            src={logo}
            width="60"
            height="60"
            alt="logo"
          />
          <span className="title-logo" style={{ fontSize: 20, marginLeft: 10 }}>
            TrungAnh Shop
          </span>
        </div>
        <span className="text" style={{ fontWeight: "bold" }}>
        Để đáp ứng nhu cầu ngày càng cao của khách hàng, TrungAnh Shop đã và đang bán các sản phẩm sau:
        </span>
        <div style={{ marginLeft: 10 }}>
          <span className="text">- &nbsp;<Link to="/category/1">Áo</Link></span>
          <span className="text">- &nbsp;<Link to="/category/2">Quần</Link></span>
          <span className="text">- &nbsp;<Link to="/category/3">Giày</Link></span>
          <span className="text">- &nbsp;<Link to="/category/4">Mặt hàng khác</Link></span>
        </div>
        <h2 style={{ fontWeight: "bold" }}>Chọn TrungAnh Shop</h2>
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Card
                title={ <span><CarTwoTone style={{ fontSize: 20 }} /> Giao hàng toàn quốc</span>}
                bordered={false}
              >
               Giao hàng cực nhanh cùng nhiều ưu đãi hỗ trợ vận chuyển hấp dẫn.
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title={<span><ShoppingTwoTone style={{ fontSize: 20 }} /> Sản phẩm đa dạng</span>}
                bordered={false}
              >
              Áo sơ mi, quần dài và các loại phụ kiện luôn chờ đợi bạn.
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title={
                  <span>
                    <LikeTwoTone style={{ fontSize: 20 }} /> Tiện ích
                  </span>
                }
                bordered={false}
              >
              Bạn có thể đặt hàng và theo dõi đơn hàng mọi lúc, mọi nơi.
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title={
                  <span>
                    <MobileTwoTone style={{ fontSize: 20 }} />Hỗ trợ mua hàng trên nhiều nền tảng
                  </span>
                }
                bordered={false}
              >
            Bạn có thể mua hàng trên trang web và ứng dụng di động.
              </Card>
            </Col>
          </Row>
        </div>
        <span className="text" style={{ fontWeight: "bold" }}>
        TrungAnh Shop xin cam kết với khách hàng:
        </span>
        <div style={{ marginLeft: 10 }}>
          <span className="text">- &nbsp;Sản phẩm đạt tiêu chuẩn chất lượng.</span>
          <span className="text">
            - &nbsp;Đội ngũ chăm sóc khách hàng của chúng tôi sẵn sàng hỗ trợ bạn 24/7.
          </span>
          <span className="text">
            - &nbsp;Sản phẩm của bạn sẽ được đóng gói cẩn thận và vận chuyển an toàn đến địa chỉ của bạn.
          </span>
          <span className="text">
            - &nbsp;Thông tin cá nhân của bạn sẽ được bảo mật và không bao giờ chia sẻ với bên thứ ba.
          </span>
          <span className="text">
            - &nbsp;Bạn có quyền đổi hoặc trả hàng trong vòng 7 ngày kể từ ngày nhận hàng.
          </span>
        </div>
        <span className="text" style={{ marginTop: 20 }}>
        Chúng tôi mong muốn bạn có trải nghiệm mua sắm thú vị và hài lòng tại TrungAnh Shop. Cảm ơn bạn đã tin tưởng và ủng hộ chúng tôi!
        </span>
      </div>
    </div>
  );
}
