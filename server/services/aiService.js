const classifyComplaint = (description) => {
  const desc = description.toLowerCase();
  
  const mappings = [
    { keywords: ['road', 'pothole', 'street', 'highway'], category: 'road', priority: 'normal', deptCode: 'ROAD' },
    { keywords: ['garbage', 'waste', 'trash', 'dump', 'smell', 'litter'], category: 'garbage', priority: 'normal', deptCode: 'GARBAGE' },
    { keywords: ['light', 'streetlight', 'dark', 'lamp', 'electricity', 'power'], category: 'streetlight', priority: 'normal', deptCode: 'ELECTRICITY' },
    { keywords: ['water', 'leak', 'pipe', 'supply', 'shortage'], category: 'water', priority: 'high', deptCode: 'WATER' },
    { keywords: ['drain', 'sewage', 'overflow', 'gutter', 'stink'], category: 'drainage', priority: 'high', deptCode: 'DRAINAGE' },
    { keywords: ['electric', 'short circuit', 'wire', 'shock', 'spark'], category: 'electricity', priority: 'urgent', deptCode: 'ELECTRICITY' }
  ];

  for (const m of mappings) {
    if (m.keywords.some(k => desc.includes(k))) {
      // Check for urgent keywords to upgrade priority
      let finalPriority = m.priority;
      if (desc.includes('danger') || desc.includes('emergency') || desc.includes('injury') || desc.includes('fire')) {
        finalPriority = 'urgent';
      } else if (desc.includes('urgent') || desc.includes('asap') || desc.includes('critical')) {
        finalPriority = 'high';
      }
      
      const deptNames = {
        'ROAD': 'Road Maintenance Department',
        'GARBAGE': 'Sanitation Department',
        'ELECTRICITY': 'Electricity Department',
        'WATER': 'Water Supply Department',
        'DRAINAGE': 'Drainage Department'
      };
      
      return { 
        category: m.category, 
        priority: finalPriority, 
        deptCode: m.deptCode,
        deptName: deptNames[m.deptCode] || 'Unassigned',
        department: deptNames[m.deptCode] || 'Unassigned'
      };
    }
  }

  return { category: 'other', priority: 'normal', deptCode: null, deptName: 'Unassigned', department: 'Unassigned' };
};

module.exports = { classifyComplaint };
