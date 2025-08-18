
export type ServiceStatus = 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';

export interface Service {
    id: string;
    name: string;
    status: ServiceStatus;
    message: string;
    latency?: number;
}

export interface StatusResponse {
    overallStatus: ServiceStatus;
    lastChecked: string;
    services: Service[];
}

// --- MOCK DATA AND LOGIC ---

let services: Service[] = [
    { id: 'rsp', name: 'RSP Server (LPA)', status: 'OPERATIONAL', message: 'All systems normal.' },
    { id: 'smdp', name: 'SM-DP+', status: 'OPERATIONAL', message: 'All systems normal.' },
    { id: 'qr_generator', name: 'QR Generator', status: 'OPERATIONAL', message: 'All systems normal.' },
    { id: 'activation_engine', name: 'Activation Engine', status: 'OPERATIONAL', message: 'All systems normal.' },
    { id: 'viber_bot', name: 'Viber Bot Gateway', status: 'OPERATIONAL', message: 'All systems normal.' },
    { id: 'payment_gateway', name: 'Payment Gateway', status: 'OPERATIONAL', message: 'All systems normal.' },
    { id: 'api_gateway', name: 'Public API Gateway', status: 'OPERATIONAL', message: 'All systems normal.' },
    { id: 'customer_db', name: 'Customer Database', status: 'OPERATIONAL', message: 'All systems normal.' },
];

const messages = {
    OPERATIONAL: "All systems normal.",
    DEGRADED: "Experiencing intermittent issues.",
    OUTAGE: "Service is currently unavailable.",
};

// Function to randomly degrade a service for demo purposes
const simulateRealWorldConditions = () => {
    services.forEach(service => {
        // Give a chance to recover
        if (service.status !== 'OPERATIONAL' && Math.random() > 0.4) {
             service.status = 'OPERATIONAL';
        }

        // Randomly degrade or cause outage - chances are now extremely low
        const random = Math.random();
        if (random > 0.99998) { // 0.002% chance of outage
            service.status = 'OUTAGE';
        } else if (random > 0.9999) { // 0.01% chance of degradation
            service.status = 'DEGRADED';
        }
        
        service.message = messages[service.status];
        service.latency = Math.floor(Math.random() * (service.status === 'DEGRADED' ? 400 : 120)) + 20;
    });
};

const getOverallStatus = (): ServiceStatus => {
    const statuses = services.map(s => s.status);
    if (statuses.some(s => s === 'OUTAGE')) return 'OUTAGE';
    if (statuses.some(s => s === 'DEGRADED')) return 'DEGRADED';
    return 'OPERATIONAL';
}


// --- SIMULATED API FUNCTIONS ---

/**
 * Fetches the system status.
 * @returns A Promise that resolves to a StatusResponse object.
 */
export const getStatus = async (): Promise<StatusResponse> => {
    // Simulate real-world fluctuations
    simulateRealWorldConditions();
    
    // Simulate network latency
    const latency = 200 + Math.random() * 300;

    // Simulate a complete failure to fetch data sometimes - chance is now extremely low
    if (Math.random() < 0.00005) { // 0.005% chance of total failure
        return new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error("Failed to connect to the status server."));
            }, latency);
        });
    }
    
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                overallStatus: getOverallStatus(),
                lastChecked: new Date().toISOString(),
                services: [...services] // Return a copy
            });
        }, latency);
    });
};


export interface PurchaseRequest {
    operator: 'MPT' | 'ATOM' | 'Ooredoo' | 'Mytel';
    contactInfo: string;
}

export interface PurchaseResponse {
    success: boolean;
    orderId: string;
    paymentInfo: {
        qrData: string;
        amount: number;
        currency: 'MMK';
        expires: string;
    };
    message: string;
}

/**
 * Simulates an eSIM purchase.
 * @param data The purchase request data.
 * @returns A Promise that resolves to a PurchaseResponse object.
 */
export const purchase = async (data: PurchaseRequest): Promise<PurchaseResponse> => {
     return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                success: true,
                orderId: `NEX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                paymentInfo: {
                    qrData: "00020101021229370016A00000067701011101130940523000570208QRPAS0010303001510580000000000080000MMK520454125303104540680000.5802MM5910Nexora AI6006Yangon62580110NEX-ABCDEF0208123456780308987654320708MM12345663041F4C",
                    amount: 80000,
                    currency: 'MMK',
                    expires: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
                },
                message: "Purchase initiated. Please proceed with payment.",
            });
        }, 800);
     });
}
