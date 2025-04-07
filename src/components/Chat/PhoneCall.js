import { useState}  from "react";

import {IconPhone} from "components/Common/Icons";
import Modal from "components/Common/Modal";

const PhoneCall = () => {
    const [pullPhoneCall, setPullPhoneCall] = useState(false);
    return (
      <>
          {
              pullPhoneCall && (
                  <Modal onConfirm={() => setPullPhoneCall(false)}
                         onCancel={() => setPullPhoneCall(false)}
                  >
                      <div className='flex flex-col items-center'>
                          <p>你确定要与&nbsp;</p>
                          <p style={{
                              textDecoration: 'underline',
                              textDecorationThickness: '0.7em',
                              textDecorationColor: 'rgba(221, 215, 207, 1)',
                              textUnderlineOffset: '-0.4em',
                              textDecorationSkipInk: 'none',
                          }}>
                              XXXX
                          </p>
                          <p>&nbsp;进行语音通话吗？</p>
                      </div>
                  </Modal>
              )
          }
          <button title='语音通话'
                  className='h-full flex items-center justify-center'
                  onClick={() => setPullPhoneCall(true)}
          >
              <IconPhone/>
          </button>

      </>
    )
}

export default PhoneCall;