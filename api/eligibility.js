// /api/eligibility.js

export default async function handler(req, res) {
  const { address } = req.query; // Get the address from query params

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  // Example eligibility data - replace with real data
  const users = {
    '0xe8811abedb1046e7055a2f7a9b45a361da0b826d': { eligible: true, value: 1000, proof: ['0x85b8267a342d91c46343fd43b0fd919f473aae058b7d3b5eb608c5efdfb55c98', '0x80ca323ff5330337930f57e16cb7adb0afff745135574f86332c35b9a7fd91cb', '0x4cce5f6a8c7381803d8692ae786ef39be8301b8ff1a5cd7df8a72dcd52b978f4'] },
    '0x6c2e8ec62e9efe869024eece4d99a2a31e3de006': { eligible: true, value: 2000, proof: ['0x0539b1a96572b00a1b91b93cc9b823d9afbe33455e76ba591a1069b144096d18', '0x80ca323ff5330337930f57e16cb7adb0afff745135574f86332c35b9a7fd91cb', '0x4cce5f6a8c7381803d8692ae786ef39be8301b8ff1a5cd7df8a72dcd52b978f4'] },
    '0x0e15e70f74e5ed138d449e868def1415f9a3e24d': { eligible: true, value: 3000, proof: ['0xe151fd2b9fb11fda312d283fc089c0b1c3eccf81e6f23615c4b0df6c3f2fee91', '0x594bcb1158994146a211f704f0a2ce58fa1223a10d09289d9f7798070bf87cfe', '0x4cce5f6a8c7381803d8692ae786ef39be8301b8ff1a5cd7df8a72dcd52b978f4'] },
    '0xf41c24da6ae70cb99e050e11197ec88237ca7724': { eligible: true, value: 4000, proof: ['0x6a4810dc63f023b866420fa4c7fea090f425bedcaa26e04c0fa09a148bddb847'] },
    '0x00000012ec7f8928bd4deb14da43d53184ad6a51': { eligible: true, value: 5000, proof: ['0x689f28c25844fb682cbe2d5998f6b71fe0783b16bd5c8b8424c61111d6000b59', '0x594bcb1158994146a211f704f0a2ce58fa1223a10d09289d9f7798070bf87cfe', '0x4cce5f6a8c7381803d8692ae786ef39be8301b8ff1a5cd7df8a72dcd52b978f4'] },
    '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd': { eligible: false, value: 0, proof: [] }
  };

  const user = users[address.toLowerCase()];
  //const user = users[address];

  if (user) {
    return res.status(200).json(user); // Return user eligibility data
  } else {
    return res.status(404).json({ eligible: false, value: 0, proof: [] });
  }
}
