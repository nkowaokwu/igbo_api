import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import Modal from './Modal';
import WelcomeSceneOne from '../assets/images/welcomeSceneOne.svg';
import WelcomeSceneTwo from '../assets/images/welcomeSceneTwo.svg';
import WelcomeSceneThree from '../assets/images/welcomeSceneThree.svg';
import WelcomeSceneFour from '../assets/images/welcomeSceneFour.svg';

const WelcomeScene = ({
  title,
  description,
  image,
  alt,
}) => (
  <div className="welcomeSceneContainer">
    <h1>{title}</h1>
    <p>{description}</p>
    <img src={image} alt={alt} />
  </div>
);

WelcomeScene.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.element.isRequired,
  alt: PropTypes.string.isRequired,
};

const WelcomeCarousel = () => {
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  useEffect(() => {
    const isWelcomeWizardCompleted = localStorage.getItem('nkowaokwu_welcome_wizard_completed');
    if (isWelcomeWizardCompleted !== 'true') {
      setIsWelcomeModalOpen(true);
    }
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    draggable: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Modal
      title=""
      isOpen={isWelcomeModalOpen}
      onRequestClose={() => {
        localStorage.setItem('nkowaokwu_welcome_wizard_completed', true);
        setIsWelcomeModalOpen(false);
      }}
      className="modal-container"
    >
      <div>
        <Slider className="flex flex-row items-end" {...settings}>
          <WelcomeScene
            title="Welcome to Nkowa okwu!"
            description="An online Igbo Dictionary for anyone learning the Igbo culture and language."
            image={WelcomeSceneOne}
            alt="Woman sitting in building using phone"
          />
          <WelcomeScene
            title="We got you covered"
            description={`We know learning Igbo is no easy feat. 
            That’s why we include helpful features like accent marks, word variations, and detailed examples 
            to guide you through your learning journey.`}
            image={WelcomeSceneTwo}
            alt="Woman standing with hands on hip next to floating search bar"
          />
          <WelcomeScene
            title="We are the culture"
            description={`We define Igbo, therefore, you can contribute to this project!
            Don’t see a word? Suggest a word addition.
            Notice a typo in an example? Submit a revision.`}
            image={WelcomeSceneThree}
            alt="Man standing up giving two thumbnails next to flowing profile screen"
          />
          <WelcomeScene
            title="Want to help even more?"
            description={`If you are a native Igbo speaker, and want to help verify words and examples, 
            or want to see a new feature on the platform, please send an email to igboapi@gmail.com!`}
            image={WelcomeSceneFour}
            alt="Man sitting down using laptop"
          />
        </Slider>
      </div>
    </Modal>
  );
};

export default WelcomeCarousel;
