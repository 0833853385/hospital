import PropTypes from 'prop-types';
import './index.scoped.scss';

const Loading = ({ variant = 'default', size = 'md', text = 'Đang tải...', fullScreen = false }) => {
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={`loader-spinner size-${size}`}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">{text}</span>
            </div>
            {text && <div className="mt-2 text-primary">{text}</div>}
          </div>
        );

      case 'dots':
        return (
          <div className={`loader-dots size-${size}`}>
            <div className="dots-pulse">
              <div></div>
              <div></div>
              <div></div>
            </div>
            {text && <div className="mt-2">{text}</div>}
          </div>
        );

      case 'medical':
        return (
          <div className={`loader-medical size-${size}`}>
            <div className="medical-icon">
              <i className="fas fa-heartbeat pulse"></i>
            </div>
            {text && <div className="mt-2">{text}</div>}
          </div>
        );

      case 'progress':
        return (
          <div className={`loader-progress size-${size}`}>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            {text && <div className="mt-2">{text}</div>}
          </div>
        );

      default:
        return (
          <div className={`loader-default size-${size}`}>
            <div className="circular-loader"></div>
            {text && <div className="mt-2">{text}</div>}
          </div>
        );
    }
  };

  return (
    <div className={`loader-container ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="loader-content">
        {renderLoader()}
      </div>
    </div>
  );
};

Loading.propTypes = {
  variant: PropTypes.oneOf(['default', 'spinner', 'dots', 'medical', 'progress']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  text: PropTypes.string,
  fullScreen: PropTypes.bool
};

export default Loading;
