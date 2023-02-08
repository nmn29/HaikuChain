import Fade from 'react-reveal/Fade';
import { useModal } from 'react-hooks-use-modal';
import './stylesheets/Top.css'
import './stylesheets/top-button.css'

export default function RuleModal() {

  const [Modal, open, close] = useModal('root', {
    preventScroll: true,
  });

  const modalStyle = {
    backgroundColor: '#fff',
    borderRadius: '10px',
  };

  return (
    <div>
      <Modal>
        <Fade>
          <div className="modal" style={modalStyle}>
            <i onClick={close} class="fa-solid fa-xmark"></i>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}