import { TemplateRenderer } from '../templateRenderer';

describe('TemplateRenderer', () => {
  describe('Python slice syntax conversion', () => {
    it('should convert {{variable[:4]}} to {{first variable 4}}', () => {
      const template = '<p>{{exp.start_date[:4]}}</p>';
      const context = {
        exp: {
          start_date: '2020-01-15'
        }
      };

      const result = TemplateRenderer.render(template, context);
      expect(result).toBe('<p>2020</p>');
    });

    it('should convert {{variable[4:]}} to {{substr variable 4}}', () => {
      const template = '<p>{{name[4:]}}</p>';
      const context = {
        name: 'John Doe'
      };

      const result = TemplateRenderer.render(template, context);
      expect(result).toBe('<p> Doe</p>');
    });

    it('should convert {{variable[-4:]}} to {{last variable 4}}', () => {
      const template = '<p>{{year[-4:]}}</p>';
      const context = {
        year: '2020'
      };

      const result = TemplateRenderer.render(template, context);
      expect(result).toBe('<p>2020</p>');
    });
  });

  describe('Loop variable slice syntax', () => {
    it('should handle slice syntax inside loops', () => {
      const template = `
        {% for exp in experience_data %}
          <p>{{exp.start_date[:4]}} - {{exp.end_date[:4]}}</p>
        {% endfor %}
      `;
      const context = {
        experience_data: [
          { start_date: '2020-01-15', end_date: '2022-12-31' },
          { start_date: '2018-06-01', end_date: '2019-08-15' }
        ]
      };

      const result = TemplateRenderer.render(template, context);
      expect(result).toContain('<p>2020 - 2022</p>');
      expect(result).toContain('<p>2018 - 2019</p>');
    });
  });

  describe('Django syntax conversion', () => {
    it('should convert {% if %} to {{#if}}', () => {
      const template = '{% if name %}<p>{{name}}</p>{% endif %}';
      const context = { name: 'John' };

      const result = TemplateRenderer.render(template, context);
      expect(result).toBe('<p>John</p>');
    });

    it('should convert {% for %} to {{#each}}', () => {
      const template = `
        {% for skill in skills_data %}
          <li>{{skill.name}}</li>
        {% endfor %}
      `;
      const context = {
        skills_data: [
          { name: 'JavaScript' },
          { name: 'Python' }
        ]
      };

      const result = TemplateRenderer.render(template, context);
      expect(result).toContain('<li>JavaScript</li>');
      expect(result).toContain('<li>Python</li>');
    });
  });

  describe('Year helper', () => {
    it('should extract year from date string', () => {
      const template = '<p>{{year start_date}}</p>';
      const context = { start_date: '2020-01-15' };

      const result = TemplateRenderer.render(template, context);
      expect(result).toBe('<p>2020</p>');
    });
  });
});
