const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        expect(isRealString(1)).toBeFalsy();        
    });

    it('should reject string with only spaces', () => {
        expect(isRealString('   ')).toBeFalsy();
    });
    
    it('should allow string with non-spaces characters', () => {
        expect(isRealString('string')).toBeTruthy();
    });
});