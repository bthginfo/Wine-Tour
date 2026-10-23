import {test,expect} from '@playwright/test';

test('accent-tolerant search and article navigation preserve the category and offer a direct wine-style comparison',async({page})=>{
 await page.setViewportSize({width:360,height:800});await page.goto('/entdecken');await expect(page.locator('.app-shell')).toHaveAttribute('data-ready','true');
 await page.getByRole('button',{name:'Weinarten',exact:true}).click();await page.getByLabel('Weinwissen durchsuchen').fill('Rose');
 await page.locator('.article-card').filter({has:page.getByRole('heading',{name:'Rosé',exact:true})}).click();await expect(page.getByRole('heading',{name:'Rosé.',exact:true})).toBeVisible();
 await page.locator('.related-links').getByRole('link',{name:'Rotwein',exact:true}).click();await expect(page.getByRole('heading',{name:'Rotwein.',exact:true})).toBeVisible();await page.locator('.back-link').click();
 await expect(page.getByRole('button',{name:'Weinarten',exact:true})).toHaveAttribute('aria-pressed','true');await expect(page.getByLabel('Weinwissen durchsuchen')).toHaveValue('Rose');await expect(page.locator('.article-card').filter({has:page.getByRole('heading',{name:'Rosé',exact:true})})).toBeVisible();
 await page.getByRole('button',{name:'Alle Artikel anzeigen',exact:true}).click();await expect(page.getByLabel('Weinwissen durchsuchen')).toHaveValue('');await expect(page.getByRole('button',{name:'Alles',exact:true})).toHaveAttribute('aria-pressed','true');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
