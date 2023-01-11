import Slider from "react-slick";
import './stylesheets/rules.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Rules(){

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return(
    <div className="rules">
      <h1>ルール</h1>
      <Slider {...settings}>
        <div className="inRule">
          <h3>俳句を作ろう！</h3>
          <p>
            最大5人でお題を出し合い、<br/>
            一文字ずつ
          </p>
        </div>
        <div className="inRule">
          <h3>2</h3>
        </div>
        <div className="inRule">
          <h3>3</h3>
        </div>
        <div className="inRule">
          <h3>4</h3>
        </div>
      </Slider>
    </div>
  );
}