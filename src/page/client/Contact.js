import React, { useState } from "react";
import logo from "../../images/logo.png";
import { Input, Button, Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import {
  EnvironmentTwoTone,
  ClockCircleTwoTone,
  PhoneTwoTone,
  MailTwoTone,
} from "@ant-design/icons";

const { TextArea } = Input;

export default function Contact() {
  const [value, setValue] = useState("");

  return (
    <div style={{ marginTop: 20, marginLeft: 30 }}>
      <Breadcrumb style={{ fontSize: 18, padding: "20px 20px" }}>
        <Breadcrumb.Item>
          <Link to={"/home"}>Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{`Contact`}</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          display: "block",
          marginLeft: 30,
          marginRight: 40,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div>
            <h2 style={{ fontWeight: "bold" }}>
            NƠI GIẢI ĐÁP MỌI CÂU HỎI CỦA BẠN
            </h2>
            <span className="text">
            Với sứ mệnh “Khách hàng là ưu tiên số 1” chúng tôi luôn mang lại những giá trị tốt nhất
            </span>
            <div style={{ display: "inline-grid", marginBottom: 20 }}>
              <div style={{ display: "-webkit-inline-box", marginTop: 20 }}>
                <div
                  style={{ display: "flex", marginRight: 30, width: "400px" }}
                >
                  <div className="icon-contact">
                    <EnvironmentTwoTone />
                  </div>
                  <div style={{ display: "inline-grid" }}>
                    <span style={{ fontWeight: "bold", fontSize: 14 }}>
                    Địa chỉ
                    </span>
                    <span>Nga ba Thong Nhat, Dien Duong, Dien Ban</span>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div className="icon-contact">
                    <ClockCircleTwoTone />
                  </div>
                  <div style={{ display: "inline-grid" }}>
                    <span style={{ fontWeight: "bold", fontSize: 14 }}>
                      Thời gian làm việc
                    </span>
                    <span>8am - 20pm hàng ngày</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "-webkit-inline-box", marginTop: 20 }}>
                <div
                  style={{ display: "flex", marginRight: 30, width: "400px" }}
                >
                  <div className="icon-contact">
                    <PhoneTwoTone />
                  </div>
                  <div style={{ display: "inline-grid" }}>
                    <span style={{ fontWeight: "bold", fontSize: 14 }}>
                      Gọi ngay: 
                    </span>
                    <span>10032001</span>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div className="icon-contact">
                    <MailTwoTone />
                  </div>
                  <div style={{ display: "inline-grid" }}>
                    <span style={{ fontWeight: "bold", fontSize: 14 }}>
                      Email
                    </span>
                    <span>trunganh@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ width: "90%" }}>
              <h2 style={{ fontWeight: "bold" }}> LIÊN HỆ VỚI CHÚNG TÔI </h2>
              <span className="text">
              Nếu bạn có bất kỳ câu hỏi nào, bạn có thể gửi yêu cầu cho chúng tôi và chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
              </span>
              <TextArea
                placeholder="Họ và tên"
                autoSize
                style={{ marginBottom: 10 }}
              />
              <TextArea
                placeholder="Email"
                autoSize
                style={{ marginBottom: 10 }}
              />
              <TextArea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Nội dung"
                autoSize={{ minRows: 3, maxRows: 5 }}
                style={{ marginBottom: 10 }}
              />
              <Button type="primary" htmlType="submit" style={{ width: 100 }}>
                Gửi
              </Button>
            </div>
          </div>
          <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.803925299805!2d108.20836027596944!3d16.023719284649157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142198ba0e8235f%3A0x5de37dc917ddcc86!2zMTE1IMSQ4buXIFRow7pjIFThu4tuaCwgS2h1w6ogVHJ1bmcsIEPhuqltIEzhu4csIMSQw6AgTuG6tW5nIDUwNzA4LCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1702461950143!5m2!1svi!2s"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
