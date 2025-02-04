import React from "react";
import { Layout, Row, Col } from "antd";
import logo from "../images/logo.png";
import {
  FacebookFilled,
  GoogleCircleFilled,
  GithubFilled,
  TwitterCircleFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Footer } = Layout;
export default function FooterWeb() {
  return (
    <Footer className="footer">
      <Row>
        <Col xl={6} className="widget-footer style1">
          <div style={{ display: "flex", marginTop: 15 }}>
            <img
              className="img-logo"
              src={logo}
              width="40"
              height="40"
              alt="logo"
            />

            <span className="title-logo" style={{ fontSize: 20, marginLeft: 10, marginTop: 5 }}>
              TrungAnh shop
            </span>
          </div>
          <div style={{marginTop: 27}}>
            <span>
               "Thời trang cho mọi người" hướng đến đối tượng khách hàng vô cùng đa dạng cho mọi lứa tuổi."
            </span>
          </div>
        </Col>
        <Col xl={6} className="widget-footer style2">
          <h2 className="widget-title-footer">Tài khoản</h2>
          <ul>
            <li>
              <Link to={{ pathname: "/" }}>Đăng nhập</Link>
            </li>
            <li>
              <Link to={{ pathname: "/" }}>Đăng ký</Link>
            </li>
            <li>
              <Link to={{ pathname: "/billfollow" }}>Đơn hàng</Link>
            </li>
            <li>
              <Link to={{ pathname: "/cart" }}>Giỏ hàng</Link>
            </li>
          </ul>
        </Col>
        <Col xl={6} className="widget-footer style3">
          <h2 className="widget-title-footer">Cửa hàng</h2>
          <ul>
            <li>
              <Link to={{ pathname: "/" }}>Khám phá</Link>
            </li>
            <li>
              <Link to={{ pathname: "/" }}>Liên hệ</Link>
            </li>
            <li>
              <Link to={{ pathname: "/" }}>Giới thiệu</Link>
            </li>
          </ul>
        </Col>
        <Col xl={6} className="widget-footer style4">
          <h2 className="widget-title-footer">Phản hồi cho chúng tôi</h2>
          <ul>
            <li>
              <a href="" target="_blank">
                <FacebookFilled />
              </a>
            </li>
            <li>
              <a>
                <GoogleCircleFilled />
              </a>
            </li>
            <li>
              <a href="" target="_blank">
                <GithubFilled />
              </a>
            </li>
            <li>
              <a>
                <TwitterCircleFilled />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Footer>
  );
}
