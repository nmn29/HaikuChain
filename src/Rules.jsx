import Slider from "react-slick";
import './stylesheets/rules.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Rules(){

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return(
    <div className="rules">
      <Slider {...settings}>
        <div className="inRule">
          <h3>俳句を作ろう！</h3>
          <p>
            最大5人のリレー形式で<br/>
            名句を作成しましょう<br/>            
          </p>
        </div>
        <div className="inRule">
          <h3>お題を出す</h3>
          <p>
            ユニークなお題を決め、<br/>

          </p>
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