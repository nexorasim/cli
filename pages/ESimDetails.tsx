import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import qrcode from 'qrcode';
import GlassCard from '../components/GlassCard';
import { useI18n } from '../hooks/useI18n';
import { BRAND_INFO } from '../constants';
import { esimPlans, ESimPlan } from '../data/plans';
import { CheckIcon, UploadIcon, CameraIcon, SpinnerIcon, SuccessIcon, FailureIcon, ViberIcon, DownloadIcon } from '../components/SocialIcons';
import { generateMMQRData } from '../lib/mmqr';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { safeJsonParse } from '../lib/utils';

const operators = [
    { name: "MPT", color: "from-sky-400 to-indigo-600" },
    { name: "ATOM", color: "from-green-400 to-teal-500" },
    { name: "Ooredoo", color: "from-red-500 to-rose-500" },
    { name: "Mytel", color: "from-purple-500 to-fuchsia-600" }
];

const CountdownTimer: React.FC<{ expiryTimestamp: number, onExpire: () => void }> = ({ expiryTimestamp, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState(expiryTimestamp - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const newTimeLeft = expiryTimestamp - Date.now();
            if (newTimeLeft <= 0) {
                clearInterval(interval);
                setTimeLeft(0);
                onExpire();
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [expiryTimestamp, onExpire]);

    const minutes = Math.floor((timeLeft / 1000) / 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return <span className="font-mono text-lg">{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>;
};


const ESimDetails: React.FC = () => {
    const { t, locale } = useI18n();
    usePageMetadata('page_title_esim', 'page_description_esim');
    
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState<ESimPlan | null>(null);
    const [selectedOperator, setSelectedOperator] = useState<string | null>(null);
    const [contactInfo, setContactInfo] = useState('');
    const [isContactValid, setIsContactValid] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [verificationResult, setVerificationResult] = useState<{ success: boolean; orderNumber?: string; reason?: string; transactionId?: string; } | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [paymentExpiry, setPaymentExpiry] = useState<number>(0);
    const [orderId, setOrderId] = useState<string>('');
    const [mmqrData, setMmqrData] = useState<string>('');
    const [isCodeExpired, setIsCodeExpired] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const qrCanvasRef = useRef<HTMLCanvasElement>(null);
    const contactInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (currentStep === 3 && contactInputRef.current) {
            contactInputRef.current.focus();
        }
    }, [currentStep]);

    const handlePlanSelect = (plan: ESimPlan) => {
        if (plan.isAvailable) {
            setSelectedPlan(plan);
            setCurrentStep(2);
        }
    };
    
    const handleOperatorSelect = (operator: string) => {
        setSelectedOperator(operator);
        setCurrentStep(3);
    };

    const goToPaymentStep = () => {
        if (!isContactValid) return;
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const newOrderId = `#NXR-${year}${month}${day}-${hours}${minutes}${seconds}`;
        
        setOrderId(newOrderId);
        if (selectedPlan) {
            const newMmqrData = generateMMQRData(newOrderId, selectedPlan.price);
            setMmqrData(newMmqrData);
        }
        setCurrentStep(4);
        setPaymentExpiry(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    };

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^09\d{5,9}$/;
        const isValid = emailRegex.test(contactInfo) || phoneRegex.test(contactInfo);
        setIsContactValid(isValid);
    }, [contactInfo]);

    useEffect(() => {
        if (currentStep === 4 && qrCanvasRef.current && mmqrData) {
            qrcode.toCanvas(qrCanvasRef.current, mmqrData, { width: 200, margin: 1, color: { dark: '#0A0F1A', light: '#FFFFFF' } }, (error) => {
                if (error) console.error("QR Code generation error:", error);
            });
        }
    }, [currentStep, mmqrData]);
    
    useEffect(() => {
        const { gsap } = window as any;
        if (gsap && contentRef.current) {
            gsap.fromTo( contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power3.out' });
        }
    }, []);

    useEffect(() => {
        const existingScript = document.getElementById('product-schema');
        if (existingScript) {
            existingScript.remove();
        }

        if (selectedPlan) {
            const schema = {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": `${selectedPlan.name} eSIM for Myanmar`,
                "description": `A ${selectedPlan.data} data plan valid for ${selectedPlan.validity}. High-speed 4G/5G internet access in Myanmar.`,
                "image": `https://esim.com.mm/og-image.png`,
                "brand": {
                    "@type": "Brand",
                    "name": BRAND_INFO.name
                },
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "MMK",
                    "price": selectedPlan.price.toString(),
                    "availability": "https://schema.org/InStock",
                    "url": `https://esim.com.mm/#/buy-esim`,
                    "seller": {
                        "@type": "Organization",
                        "name": BRAND_INFO.name
                    }
                },
            };

            const script = document.createElement('script');
            script.id = 'product-schema';
            script.type = 'application/ld+json';
            script.innerHTML = JSON.stringify(schema);
            document.head.appendChild(script);
        }
        
        return () => {
            const scriptOnCleanup = document.getElementById('product-schema');
            if (scriptOnCleanup) {
                scriptOnCleanup.remove();
            }
        }
    }, [selectedPlan]);
    
    const handleFileChange = (selectedFile: File | null) => {
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };
    
    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { handleFileChange(e.target.files ? e.target.files[0] : null); };
    const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setIsDragOver(true);
        else if (e.type === 'dragleave') setIsDragOver(false);
    };
    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileChange(e.dataTransfer.files[0]);
    };

    const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                const [, data] = result.split(',');
                const mimeType = result.match(/:(.*?);/)?.[1] || file.type;
                resolve({ mimeType, data });
            };
            reader.onerror = error => reject(error);
        });
    }

    const handleVerify = async () => {
        if (!file || !selectedPlan) return;
        setIsVerifying(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const { mimeType, data } = await fileToBase64(file);
            const imagePart = { inlineData: { mimeType, data } };
            const textPart = { text: `You are Nexora AGI, an automated payment verification system for eSIM Myanmar.
Analyze the attached payment receipt screenshot for an eSIM purchase.

**Order Details:**
- **Order ID:** ${orderId}
- **Expected Amount:** ${selectedPlan.price} MMK
- **Current Time:** ${new Date().toISOString()}

**Verification Steps:**
1.  **Confirm Payment:** Verify that the screenshot shows a successful transaction.
2.  **Match Amount:** Check if the paid amount is exactly **${selectedPlan.priceFormatted}**.
3.  **Check Recency:** Ensure the transaction was made within the last 12 hours.
4.  **Extract Transaction ID:** Find the transaction ID or reference number from the receipt.

Respond with a JSON object ONLY, based on the schema.` };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            isPaymentConfirmed: {
                                type: Type.BOOLEAN,
                                description: `True if the screenshot confirms a successful payment of exactly ${selectedPlan.price} MMK made within the last 12 hours. False otherwise.`
                            },
                            reason: {
                                type: Type.STRING,
                                description: "A brief, one-sentence explanation for the decision. e.g., 'Amount matches and transaction is recent.' or 'The transaction is older than 12 hours.'"
                            },
                            transactionId: {
                                type: Type.STRING,
                                description: "The transaction ID from the receipt, if visible. Otherwise, 'N/A'."
                            }
                        },
                        required: ["isPaymentConfirmed", "reason", "transactionId"]
                    }
                }
            });
            
            const text = response.text?.trim();
            if (!text) {
                throw new Error("AI verification response was empty.");
            }

            const [parseError, jsonResponse] = safeJsonParse(text);

            if (parseError) {
                console.error("Verification JSON parse error:", parseError);
                setVerificationResult({ success: false, reason: "AI verification failed. The response was unreadable. Please try again." });
                return;
            }
            
            if (jsonResponse.isPaymentConfirmed) {
                setVerificationResult({ success: true, orderNumber: orderId, reason: jsonResponse.reason, transactionId: jsonResponse.transactionId });
            } else {
                setVerificationResult({ success: false, reason: jsonResponse.reason || t('esim_verification_failed_message') });
            }
        } catch (err) {
            console.error("Verification error:", err);
            setVerificationResult({ success: false, reason: t('esim_verification_failed_message') });
        } finally {
            setIsVerifying(false);
            setCurrentStep(5);
        }
    };
    
    const handleDownloadQR = () => {
        if (!qrCanvasRef.current) return;
        const link = document.createElement('a');
        link.href = qrCanvasRef.current.toDataURL('image/png');
        link.download = `eSIM_Myanmar_Payment_${orderId.replace('#', '')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReset = () => {
        setCurrentStep(1);
        setSelectedPlan(null);
        setSelectedOperator(null);
        setContactInfo('');
        setIsContactValid(false);
        setFile(null);
        setPreview(null);
        setVerificationResult(null);
        setIsVerifying(false);
        setOrderId('');
        setMmqrData('');
        setIsCodeExpired(false);
    };

    const handleTryAgain = () => {
        setCurrentStep(4);
        setFile(null);
        setPreview(null);
        setVerificationResult(null);
        setIsVerifying(false);
        setPaymentExpiry(Date.now() + 10 * 60 * 1000); // Reset timer
        setIsCodeExpired(false);
    };

    const handleCodeExpired = () => {
        setIsCodeExpired(true);
    };

    const renderPlanStep = () => (
      <GlassCard className="max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-white text-center">{t('esim_select_plan_title')}</h2>
        <p className="text-gray-400 text-sm text-center mb-6">{t('esim_select_plan_subtitle')}</p>
        <div className="grid md:grid-cols-3 gap-6">
          {esimPlans.map(plan => (
            <div key={plan.id} 
              className={`relative glass-card !p-6 flex flex-col border-2 transition-all duration-300 
                ${plan.isAvailable 
                  ? (selectedPlan?.id === plan.id ? 'border-secondary ring-2 ring-secondary/50' : 'border-transparent hover:border-secondary') + ' cursor-pointer' 
                  : 'opacity-60'}`
            }>
              {plan.isPopular && <div className="absolute top-0 -right-3 bg-secondary text-primary px-3 py-1 text-xs font-bold rounded-full transform rotate-6">{t('esim_plan_popular')}</div>}
              <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
              <p className="text-lg text-secondary font-semibold mt-1">{plan.data} / {plan.validity}</p>
              <p className="text-3xl font-bold text-white my-4">{plan.priceFormatted}</p>
              <ul className="space-y-2 text-gray-300 text-sm flex-grow">
                {plan.features.map(feat => <li key={feat} className="flex items-center"><CheckIcon className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />{feat}</li>)}
              </ul>
              <button
                onClick={() => handlePlanSelect(plan)}
                disabled={!plan.isAvailable}
                className="btn-primary w-full mt-6"
              >
                {plan.isAvailable ? t('esim_plan_select_cta') : t('esim_plan_coming_soon')}
              </button>
            </div>
          ))}
        </div>
      </GlassCard>
    );

    const renderOperatorStep = () => (
        <GlassCard className="max-w-md mx-auto">
            <h2 className="text-xl font-bold text-white text-center">{t('esim_select_operator_title')}</h2>
            <p className="text-gray-400 text-sm text-center mb-4">{t('esim_select_operator_subtitle')}</p>
            <div className="grid grid-cols-2 gap-4">
                {operators.map(op => (
                    <button 
                        key={op.name} 
                        onClick={() => handleOperatorSelect(op.name)} 
                        className={`p-4 rounded-lg text-white font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-secondary/20 bg-gradient-to-br ${op.color}`}
                    >
                        {op.name}
                    </button>
                ))}
            </div>
        </GlassCard>
    );

    const renderContactStep = () => (
        <GlassCard className="max-w-md mx-auto">
            <h2 className="text-xl font-bold text-white text-center">{t('esim_enter_contact_title')}</h2>
            <p className="text-gray-400 text-sm text-center mb-4">{t('esim_enter_contact_subtitle')}</p>
            <div className="space-y-4">
                <div>
                    <label htmlFor="contact-info" className="sr-only">{t('esim_enter_contact_prompt')}</label>
                    <input 
                        id="contact-info"
                        ref={contactInputRef}
                        type="text" 
                        value={contactInfo} 
                        onChange={e => setContactInfo(e.target.value)} 
                        placeholder={t('esim_enter_contact_prompt')} 
                        className={`w-full bg-white/10 text-white placeholder-gray-400 border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 transition-all ${!isContactValid && contactInfo ? 'border-red-500/70 ring-red-500/50' : 'border-white/20 focus:ring-secondary'}`}
                        aria-describedby={!isContactValid && contactInfo ? "contact-info-error" : undefined}
                        aria-invalid={!isContactValid && contactInfo ? "true" : "false"}
                    />
                    {!isContactValid && contactInfo ? <p id="contact-info-error" role="alert" className="text-red-400 text-sm mt-1 px-1">{t('esim_enter_contact_error')}</p> : <div className="h-6 mt-1"></div>}
                </div>
                <button onClick={goToPaymentStep} disabled={!isContactValid} className="btn-primary w-full">
                    {t('esim_continue_to_payment')}
                </button>
            </div>
        </GlassCard>
    );
    
    const renderPaymentStep = () => {
        if (isVerifying) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <SpinnerIcon className="h-8 w-8 text-white" />
                    <h2 className="text-2xl font-bold text-white mt-6">{t('esim_verifying')}</h2>
                </div>
            );
        }

        if (isCodeExpired) {
            return (
                <GlassCard className="max-w-md mx-auto text-center animate-fadeInUp">
                    <FailureIcon className="w-16 h-16 mx-auto text-yellow-400" />
                    <h2 className="text-3xl font-bold text-yellow-300 mt-4">{t('esim_payment_expired_title')}</h2>
                    <p className="text-gray-300 mt-2 max-w-md mx-auto">{t('esim_payment_expired_desc')}</p>
                    <button onClick={handleReset} className="btn-primary mt-8">{t('esim_payment_expired_cta')}</button>
                </GlassCard>
            );
        }

        return (
            <GlassCard className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="text-center md:text-left">
                        <h2 className="text-xl font-bold text-white">{t('esim_payment_step_1_title')}</h2>
                        <p className="text-gray-400 mt-1 mb-2 text-sm">{t('esim_payment_step_1_desc').replace('{price}', selectedPlan?.priceFormatted || 'the amount')}</p>
                        <div className="text-secondary font-bold mb-3"><CountdownTimer expiryTimestamp={paymentExpiry} onExpire={handleCodeExpired} /></div>
                        <canvas ref={qrCanvasRef} className="rounded-lg mx-auto md:mx-0 shadow-lg bg-white p-2"/>
                        <button onClick={handleDownloadQR} className="btn-secondary mt-4 mx-auto md:mx-0">
                            <DownloadIcon /> {t('esim_download_qr')}
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-bold text-white">{t('esim_payment_step_2_title')}</h2>
                            <p className="text-xs text-secondary/80 -mt-1 mb-2">{t('esim_payment_step_2_title_clarification')}</p>
                            <p className="text-gray-400 text-sm">{t('esim_payment_step_2_desc')}</p>
                        </div>
                        <input type="file" id="receipt-upload" accept="image/*" ref={fileInputRef} onChange={onFileSelect} className="sr-only" />
                        <input type="file" id="camera-upload" accept="image/*" capture="environment" ref={cameraInputRef} onChange={onFileSelect} className="sr-only" />
                        <label htmlFor="receipt-upload" onDragEnter={handleDragEvents} onDragOver={handleDragEvents} onDragLeave={handleDragEvents} onDrop={handleDrop} className={`relative block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-300 ${isDragOver ? 'border-secondary bg-secondary/10' : 'border-white/20 hover:border-secondary/50 hover:bg-white/5'}`}>
                            {preview ? <img src={preview} alt="Screenshot preview" className="w-full h-32 object-contain rounded-md" /> : <div className="flex flex-col items-center justify-center"><UploadIcon /><p className="mt-2 text-white font-medium">{t('esim_upload_prompt')}</p></div>}
                        </label>
                        <label htmlFor="camera-upload" className="w-full text-sm text-secondary hover:underline flex items-center justify-center cursor-pointer"><CameraIcon />{t('esim_use_camera_prompt')}</label>
                        <button onClick={handleVerify} disabled={!file || isVerifying} className="btn-primary w-full">{t('esim_upload_cta')}</button>
                    </div>
                </div>
            </GlassCard>
        );
    };
    
    const renderResultStep = () => (
        <div className="flex justify-center items-center min-h-[50vh]">
            <GlassCard className="max-w-2xl w-full text-center !border-secondary/30 animate-fadeInUp">
                {verificationResult?.success ? (
                    <>
                        <SuccessIcon />
                        <h2 className="text-3xl font-bold text-green-300 mt-4">{t('esim_verification_success_title')}</h2>
                        <div className="my-6 bg-primary/50 rounded-lg p-4">
                            <p className="text-base text-gray-400">{t('esim_verification_success_order')}</p>
                            <p className="text-3xl font-bold text-secondary tracking-widest font-mono bg-black/30 py-2 px-4 rounded-md inline-block mt-2">{verificationResult.orderNumber}</p>
                        </div>
                        <div className="text-left bg-primary/30 p-6 rounded-lg">
                            <h3 className="font-bold text-white mb-4 text-lg">{t('esim_verification_success_instructions_title')}</h3>
                             <ol className="space-y-4">
                                <li className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-lg">1</div>
                                    <div>
                                        <strong className="text-white">{t('esim_verification_success_step1_title')}</strong>
                                        <p className="text-sm text-gray-400">{t('esim_verification_success_step1_desc')}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-lg">2</div>
                                    <div>
                                        <strong className="text-white">{t('esim_verification_success_step2_title')}</strong>
                                        <p className="text-sm text-gray-400">
                                            {t('esim_verification_success_step2_desc').replace('{contactInfo}', '')}
                                            <span className="font-bold text-secondary">{contactInfo}</span>
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center font-bold text-lg">3</div>
                                    <div>
                                        <strong className="text-white">{t('esim_verification_success_step3_title')}</strong>
                                        <p className="text-sm text-gray-400">{t('esim_verification_success_step3_desc')}</p>
                                    </div>
                                </li>
                            </ol>
                        </div>
                         <a href={BRAND_INFO.social.viber} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8 w-full !bg-purple-600 hover:!shadow-purple-500/40"><ViberIcon />{t('esim_viber_button')}</a>
                    </>
                ) : (
                    <>
                        <FailureIcon />
                        <h2 className="text-3xl font-bold text-red-300 mt-4">{t('esim_verification_failed_title')}</h2>
                        <p className="text-gray-200 bg-red-500/10 p-4 rounded-lg mt-4 border border-red-500/20">{verificationResult?.reason || t('esim_verification_failed_message')}</p>
                        <button onClick={handleTryAgain} className="btn-primary mt-8">{t('esim_try_again')}</button>
                    </>
                )}
            </GlassCard>
        </div>
    );
    
    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return renderPlanStep();
            case 2: return renderOperatorStep();
            case 3: return renderContactStep();
            case 4: return renderPaymentStep();
            case 5: return renderResultStep();
            default: return renderPlanStep();
        }
    }

    const stepperKeys = ['stepper_plan', 'stepper_operator', 'stepper_contact', 'stepper_pay', 'stepper_complete'] as const;

    return (
        <div ref={contentRef} className={`${locale === 'my' ? 'font-myanmar' : ''}`}>
             <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('esim_details_title')}</h1>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">{t('esim_details_subtitle')}</p>
            </div>
            
            {currentStep < 5 && (
            <div className="w-full max-w-4xl mx-auto mb-10 px-4">
                <div className="flex items-center">
                    {stepperKeys.map((stepKey, index) => (
                        <React.Fragment key={stepKey}>
                            <div className="flex flex-col items-center text-center w-1/5">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 text-lg font-bold ${
                                    currentStep > index + 1 ? 'bg-secondary text-primary' : 
                                    currentStep === index + 1 ? 'bg-secondary text-primary ring-4 ring-secondary/30' : 
                                    'bg-white/10 text-gray-400'
                                }`}>
                                    {currentStep > index + 1 ? <CheckIcon className="w-6 h-6" /> : index + 1}
                                </div>
                                <span className={`mt-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-300 ${currentStep >= index + 1 ? 'text-white' : 'text-gray-500'}`}>{t(stepKey)}</span>
                            </div>
                            {index < stepperKeys.length - 1 && <div className={`flex-grow h-1 mx-2 transition-colors duration-500 ${currentStep > index + 1 ? 'bg-secondary' : 'bg-white/10'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            )}
            
            <div key={currentStep} className="animate-step-change">
                {renderStepContent()}
            </div>
        </div>
    );
};

export default ESimDetails;