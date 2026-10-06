// Helper function to map placeholder cover strings to high-quality, realistic book cover photos from Unsplash
// If the image URL is already a valid remote image URL or data URI, it returns it directly.
export const getBookCoverUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80';
  if (
    imageUrl.startsWith('http') || 
    imageUrl.startsWith('data:') || 
    imageUrl.includes('/') || 
    imageUrl.includes('.')
  ) {
    return imageUrl;
  }
  
  // Mapping of placeholder strings to beautiful Unsplash book cover images
  const coverMap: Record<string, string> = {
    'cover-master-emotions': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80', // yellow-gold premium book cover
    'cover-la-tahzan': 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=500&q=80', // gorgeous green-blue styled book
    'cover-biday-pushpe': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80', // clean red/floral styled book
    'cover-water-resource': 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=500&q=80', // technical blueprint styled book cover
    'cover-highlander': 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=500&q=80', // leather vintage book cover
    'cover-atomic-habits': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80', // minimal habits book cover
    'cover-english-grammar': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=500&q=80', // education book cover
    'cover-career-bhabna': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=500&q=80', // leadership planner book cover
    'cover-business-last': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80', // premium analytics/business book cover
    'cover-gobeshona-101': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=500&q=80', // clean science desk research book
  };

  return coverMap[imageUrl] || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80';
};

export interface ProductTypeCheck {
  imageUrl?: string;
  type?: string;
}

export const getProductImageUrl = (product: ProductTypeCheck | undefined): string => {
  if (!product) return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80';
  const imageUrl = product.imageUrl;
  if (!imageUrl) {
    if (product.type === 'electronic') return 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=500&q=80';
    if (product.type === 'superstore') return 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=500&q=80';
    if (product.type === 'fashion') return 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=500&q=80';
    if (product.type === 'kids') return 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=500&q=80';
    return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80';
  }

  if (
    imageUrl.startsWith('http') || 
    imageUrl.startsWith('data:') || 
    imageUrl.includes('/') || 
    imageUrl.includes('.')
  ) {
    return imageUrl;
  }

  // Cover & product mockup map
  const itemMap: Record<string, string> = {
    // Books
    'cover-master-emotions': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
    'cover-la-tahzan': 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=500&q=80',
    'cover-biday-pushpe': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80',
    'cover-water-resource': 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=500&q=80',
    'cover-highlander': 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&w=500&q=80',
    'cover-atomic-habits': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
    'cover-english-grammar': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=500&q=80',
    'cover-career-bhabna': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=500&q=80',
    'cover-business-last': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80',
    'cover-gobeshona-101': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=500&q=80',

    // Electronics
    'el-orico-enclosure': 'https://images.unsplash.com/photo-1597872200919-0127a8b3fb16?auto=format&fit=crop&w=500&q=80',
    'el-sanford-torch': 'https://images.unsplash.com/photo-1517055720413-6e5454a7c44a?auto=format&fit=crop&w=500&q=80',
    'el-ugreen-cable': 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=500&q=80',
    'el-geeoo-earphone': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
    'el-silent-fan': 'https://images.unsplash.com/photo-1618945832961-1e9a4f4e7d1b?auto=format&fit=crop&w=500&q=80',
    'el-defender-fan': 'https://images.unsplash.com/photo-1523039649-56a2a9a21418?auto=format&fit=crop&w=500&q=80',
    'el-megastar-headphone': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=500&q=80',

    // Superstore
    'ss-vesoje-agro': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80',
    'ss-cosprof-oil': 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80',
    'ss-fast-sharpener': 'https://images.unsplash.com/photo-1590156221122-c7b3cd685f16?auto=format&fit=crop&w=500&q=80',
    'ss-knives-set': 'https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&w=500&q=80',
    'ss-wottagirl-perfume': 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80',
    'ss-lily-lipstick': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80',
    'ss-lily-lipstick-berry': 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=500&q=80',
    'ss-lily-lipstick-nude': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80',

    // Kids Zone
    'kd-fruit-pacifier': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80',
    'kd-barbie-doll': 'https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=500&q=80',
    'kd-wooden-puzzle': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=500&q=80',
    'kd-feeding-bottle': 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=500&q=80',
    'kd-mosquito-net': 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&w=500&q=80',
    'kd-philips-nipple': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80',
    'kd-onlybaby-nipple': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80',
  };

  const resolved = itemMap[imageUrl];
  if (resolved) return resolved;

  // Fallback defaults
  if (product.type === 'electronic') return 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=500&q=80';
  if (product.type === 'superstore') return 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=500&q=80';
  if (product.type === 'fashion') return 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=500&q=80';
  if (product.type === 'kids') return 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=500&q=80';
  return 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80';
};
