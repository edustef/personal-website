import Certificate from 'interfaces/certificate'
import React from 'react'
import CertificateBlock from './CertificateBlock'

const twColors = ['bg-blue-800', 'bg-green-800', 'bg-red-800', 'bg-pink-800']

const Certificates: React.FC<{ certificates: Certificate[] }> = ({
  certificates
}) => {
  return (
    <div className='w-full'>
      {certificates.map((props, index) => (
        <CertificateBlock
          twColor={twColors[index % twColors.length]}
          key={index}
          isRight={index % 2 != 0}
          num={index + 1}
          {...props}
        ></CertificateBlock>
      ))}
    </div>
  )
}

export default Certificates
