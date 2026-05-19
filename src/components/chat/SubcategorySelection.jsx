import React from 'react';

const SubcategorySelection = ({ category, onSelectSubcategory }) => {
  const subcategories = {
    employment: [
      'Unfair dismissal',
      'Salary disputes',
      'Workplace harassment',
      'Contract disputes',
      'Working conditions',
      'Discrimination',
    ],
    property: [
      'Landlord-tenant disputes',
      'Property ownership',
      'Lease agreements',
      'Eviction issues',
      'Land disputes',
      'Property sales',
    ],
    family: [
      'Divorce',
      'Child custody',
      'Child support',
      'Marriage issues',
      'Inheritance',
      'Domestic violence',
    ],
    business: [
      'Contract drafting',
      'Business disputes',
      'Partnership issues',
      'Debt recovery',
      'Company registration',
      'Breach of contract',
    ],
    criminal: [
      'Arrest & bail',
      'Court representation',
      'Police cases',
      'Accusations',
      'Legal defense',
      'Criminal record',
    ],
    other: [
      'Consumer rights',
      'Immigration',
      'Personal injury',
      'Wills & succession',
      'Traffic offenses',
      'Government issues',
    ],
  };

  const options = subcategories[category] || [];

  return (
    <div className="my-6 flex flex-col gap-2">
      {options.map((option, idx) => (
        <button
          key={idx}
          onClick={() => onSelectSubcategory(option)}
          className="subcategory-btn"
        >
          <span className="text-sm text-on-surface">{option}</span>
        </button>
      ))}
    </div>
  );
};

export default SubcategorySelection;