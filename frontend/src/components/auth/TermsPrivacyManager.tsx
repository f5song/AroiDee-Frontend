import React, { useState, createContext, useContext, ReactNode } from 'react';
import Modal from './Modal';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';

// ประเภทของ Modal ที่เปิดอยู่
type ModalType = 'terms' | 'privacy' | null;

// สร้าง Context สำหรับการจัดการ Terms และ Privacy
interface TermsPrivacyContextType {
  openTerms: () => void;
  openPrivacy: () => void;
  closeModal: () => void;
}

const TermsPrivacyContext = createContext<TermsPrivacyContextType>({
  openTerms: () => {},
  openPrivacy: () => {},
  closeModal: () => {},
});

// Hook สำหรับการใช้งาน Context
export const useTermsPrivacy = () => useContext(TermsPrivacyContext);

interface TermsPrivacyProviderProps {
  children: ReactNode;
}

export const TermsPrivacyProvider: React.FC<TermsPrivacyProviderProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openTerms = () => {
    setActiveModal('terms');
  };

  const openPrivacy = () => {
    setActiveModal('privacy');
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <TermsPrivacyContext.Provider value={{ openTerms, openPrivacy, closeModal }}>
      {children}

      {/* Terms of Service Modal */}
      <Modal
        isOpen={activeModal === 'terms'}
        onClose={closeModal}
        title="ข้อกำหนดและเงื่อนไขการใช้งาน"
        maxWidth="max-w-4xl"
      >
        <TermsOfService />
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={activeModal === 'privacy'}
        onClose={closeModal}
        title="นโยบายความเป็นส่วนตัว"
        maxWidth="max-w-4xl"
      >
        <PrivacyPolicy />
      </Modal>
    </TermsPrivacyContext.Provider>
  );
};

// คอมโพเนนต์ส่วนประกอบสำหรับเรียกใช้งาน
export const TermsLink: React.FC<{ className?: string }> = ({ className }) => {
  const { openTerms } = useTermsPrivacy();
  
  return (
    <button 
      onClick={openTerms} 
      className={`text-orange-500 hover:text-orange-600 hover:underline ${className || ''}`}
    >
      ข้อกำหนดและเงื่อนไขการใช้งาน
    </button>
  );
};

export const PrivacyLink: React.FC<{ className?: string }> = ({ className }) => {
  const { openPrivacy } = useTermsPrivacy();
  
  return (
    <button 
      onClick={openPrivacy} 
      className={`text-orange-500 hover:text-orange-600 hover:underline ${className || ''}`}
    >
      นโยบายความเป็นส่วนตัว
    </button>
  );
};

// คอมโพเนนต์เริ่มต้นสำหรับแสดงลิงก์ข้อกำหนดและนโยบายความเป็นส่วนตัว
const TermsPrivacyLinks: React.FC = () => {
  const { openTerms, openPrivacy } = useTermsPrivacy();

  return (
    <div className="text-sm text-gray-500">
      ด้วยการสมัครสมาชิก คุณยอมรับ{' '}
      <button 
        onClick={openTerms}
        className="text-orange-500 hover:text-orange-600 hover:underline"
      >
        ข้อกำหนดและเงื่อนไขการใช้งาน
      </button>{' '}
      และ{' '}
      <button 
        onClick={openPrivacy}
        className="text-orange-500 hover:text-orange-600 hover:underline"
      >
        นโยบายความเป็นส่วนตัว
      </button>{' '}
      ของเรา
    </div>
  );
};

export default TermsPrivacyLinks;